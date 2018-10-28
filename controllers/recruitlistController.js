const dateHelper = require('../common/helper/dateHelper');
const sessionHelper = require('../common/helper/sessionHelper');
const recruitlistService = require('../services/recruitlistService');
const vo_recruitlist = require("../viewObjects/recruitlist");

const content_id = "recruit";


/**
 * 検索結果ページのrender_objを作成する
 *
 * @param {*} data
 * @param {*} render_obj
 */
function renderRecruitList(data, render_obj){
  return recruitlistService.getScheduleList(data)
	.then(results=>{
		render_obj.bodyData = new vo_recruitlist.recruit_list_page({
			recruit_list_item: results.rows.map(row=>{
				return new vo_recruitlist.recruit_list_item({
					recruit_list_id: row.id,
					user_info: {id: row.user_id, icon: row.user_icon_url},
					date_info: row.date_key,
					event_info: {
						type: row.shot_type,
						title: row.event_name,
						prefectures: JSON.parse(row.prefecture_json),
					},
					good_review_num: 0,
					bookmark_flg: true,
					tags: JSON.parse(row.tags_json),
					anime_info: [],
				});
			}),
			recruit_list_pager: results.pages,
		});
	});
}

/**
 * 検索結果ページの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	var render_obj = res.render_obj;
	render_obj.title = "募集一覧";
	render_obj.contentId = content_id;

	const data = {
		user_type: sessionHelper.getUserType(req),
		page: req.form_data.page,
	};

	// 日付をmomentに変換する。
	data.date_key = req.form_data.date_key ? dateHelper.getDate(req.form_data.date_key) : undefined;

	renderRecruitList(data, render_obj)
	.then(()=>{
		res.render('recruitList/index', render_obj);
	})
	.catch(next);
}

/**
 * 検索結果ページの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.indexToday = function(req, res, next){
	var render_obj = res.render_obj;
	render_obj.title = "当日の募集一覧";
	render_obj.contentId = content_id + "Today";

	const data = {
		user_type: sessionHelper.getUserType(req),
		date_key: dateHelper.getDate(),
		page: req.form_data.page,
	};

	renderRecruitList(data, render_obj)
	.then(()=>{
		res.render('recruitList/index', render_obj);
	})
	.catch(next);

}
