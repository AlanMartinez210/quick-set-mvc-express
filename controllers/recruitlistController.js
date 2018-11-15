const dateHelper = require('../common/helper/dateHelper');
const sessionHelper = require('../common/helper/sessionHelper');
const recruitlistService = require('../services/recruitlistService');
const recruitBookmarkService = require('../services/recruitBookmarkService');
const vo_recruitlist = require("../viewObjects/recruitlist");
const c2Util = require("../services/c2link4DiService");

const content_id = "recruit";



/**
 * 検索結果ページのrender_objを作成する
 *
 * @param {*} data
 * @param {*} render_obj
 */
function renderRecruitList({date_key = dateHelper.getDate(), user_type, search_param = {}, page = 1} = data, render_obj){
  return recruitlistService.getScheduleList({date_key, user_type, search_param, page})
	.then(results=>{

		const recruit_list_item = results.rows.map(row=>{
			return new vo_recruitlist.recruit_list_item({
				recruit_list_id: row.id,
				user_info: {id: row.user_id, icon: row.user_icon_url},
				date_info: row.date_key,
				event_info: {
					shot_type: row.shot_type.id,
					title: row.event_name,
					prefectures: row.prefectures
				},
				good_review_num: row.good_review_num,
				bookmark_flg: row.bookmark_flg,
				tags: row.tags,
				anime_info: []
			});
		});

		const recruit_list_pager = results.pages;

		const recruit_search_info = new vo_recruitlist.recruit_search_info(search_param);

		render_obj.bodyData = new vo_recruitlist.recruit_list_page({
			recruit_list_item,
			recruit_list_pager,
			recruit_search_info
		});

	});
}

/**
 * 募集/予定一覧の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	const render_obj = res.render_obj;
	const user_type = sessionHelper.getUserType(req);
	render_obj.title = c2Util.getRecruitListTitle(user_type);
	render_obj.contentId = content_id;

	const data = { user_type: user_type };

	renderRecruitList(data, render_obj)
	.then(()=>{
		res.render('recruitList/index', render_obj);
	})
	.catch(next);
}

/**
 * 募集/予定一覧の表示(検索/ページャー)
 *
 * @param {*} req
 * @param {*} res
 */
exports.getSearchRecruit = function(req, res, next){

	console.log("search param", req.query);

	const render_obj = res.render_obj;
	const user_type = sessionHelper.getUserType(req);

	render_obj.title = c2Util.getRecruitListTitle(user_type);
	render_obj.contentId = content_id;

	const data = {
		date_key: dateHelper.getDate(),
		user_type: user_type,
		search_param: req.form_data,
		page: req.query.p,
	};

	renderRecruitList(data, render_obj)
	.then(()=>{
		res.render('recruitList/index', render_obj);
		// res.render('../content/recruitlist/recruitlist', render_obj);
	})
	.catch(err => {
		next(err);
	});
}

/**
 * 募集/予定一覧の表示(当日のみ)
 *
 * @param {*} req
 * @param {*} res
 */
exports.indexToday = function(req, res, next){
	const render_obj = res.render_obj;
	const user_type = sessionHelper.getUserType(req);

	render_obj.title = c2Util.getRecruitListTitle(user_type) + " (当日)";
	render_obj.contentId = content_id + "Today";

	const data = { date_key: dateHelper.getDate() };

	renderRecruitList(data, render_obj)
	.then(()=>{
		res.render('recruitList/index', render_obj);
	})
	.catch(next);
}

/**
 * ブックマークの登録/削除
 *
 */
exports.postRecruitBookmark = (req, res, next)=>{
  const user_id = sessionHelper.getUserId(req);
  const schedule_id = req.form_data.schedule_id;
  const mode    = req.form_data.mode; // 登録する場合 1, 削除する場合 2
  recruitBookmarkService.process(user_id, schedule_id, mode)
  .then(()=>{
    res.json({status:'success'});
  })
  .catch(next);

};
