const dateHelper = require('../common/helper/dateHelper');
const sessionHelper = require('../common/helper/sessionHelper');
const recruitlistService = require('../services/recruitlistService');
const vo_recruitlist = require("../viewObjects/recruitlist");
const c2Util = require("../services/c2link4DiService");

const content_id = "recruit";

/**
 * 募集/予定一覧の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = (req, res, next)=>{
	const render_obj = res.render_obj;
	const form_data = req.form_data;
	const user_type = sessionHelper.getUserType(req);
	const user_id = sessionHelper.getUserId(req);

	render_obj.title = c2Util.getRecruitListTitle(user_type);
	render_obj.contentId = content_id;
	render_obj.bodyData.isToday = false;

	const search_param = { user_type: user_type }

	// 当日
	if(form_data.type === 'today'){
		render_obj.title = render_obj.title + " (当日)";
		render_obj.contentId = render_obj.contentId + "Today";

		// 日付検索に当日を追加
		search_param.search_date_from = dateHelper.getDate().startOf('day');
		search_param.search_date_to = search_param.search_date_from;
		render_obj.bodyData.isToday = true;
	};

	recruitlistService.getRecruitList(user_id, search_param)
	.then(recruitList=>{
		render_obj.bodyData = new vo_recruitlist.recruit_list_page(recruitList, search_param);
		res.render('recruitList/index', render_obj);
	}).catch(next);
};

/**
 * 募集/予定一覧の表示(検索/ページャー)
 *
 * @param {*} req
 * @param {*} res
 */
exports.getSearchRecruit = (req, res, next)=>{
	const render_obj = res.render_obj;
	const form_data = req.form_data;
	const user_type = sessionHelper.getUserType(req);
	const user_id = sessionHelper.getUserId(req);
	let search_param = {};

	render_obj.title = c2Util.getRecruitListTitle(user_type);
	render_obj.contentId = content_id;
	render_obj.bodyData.isToday = false;

	// 検索項目の作成
	search_param.date_key = dateHelper.getDate();
	search_param.user_type = user_type;
	search_param = Object.assign(search_param, form_data);

	// 当日
	if(form_data.type === 'today'){
		render_obj.title = render_obj.title + " (当日)";
		render_obj.contentId = render_obj.contentId + "Today";

		render_obj.bodyData.isToday = true;
	}

	recruitlistService.getRecruitList(user_id, search_param)
	.then(recruit_list=>{
		// urlパラメーターを検索情報に含める
		const param_str = String(req.url).match(/&.*/);
		search_param.search_url_param = param_str ? param_str[0] : "";

		render_obj.bodyData = new vo_recruitlist.recruit_list_page(recruit_list, search_param);
		res.render('recruitList/index', render_obj);
	}).catch(next);
};

/**
 * ブックマークの登録/削除
 *
 */
exports.postRecruitBookmark = (req, res, next)=>{
  const user_id = sessionHelper.getUserId(req);
  const schedule_id = req.form_data.schedule_id;
	const mode    = req.form_data.mode; // 登録する場合 1, 削除する場合 0

  recruitlistService.switchingBookmark(user_id, schedule_id, mode)
  .then(()=>{
    res.json({status:'success'});
  }).catch(next);
};
