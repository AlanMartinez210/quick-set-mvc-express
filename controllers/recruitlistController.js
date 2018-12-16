const dateHelper = require('../common/helper/dateHelper');
const sessionHelper = require('../common/helper/sessionHelper');
const recruitlistService = require('../services/recruitlistService');
const recruitBookmarkService = require('../services/recruitBookmarkService');
const vo_recruitlist = require("../viewObjects/recruitlist");
const c2Util = require("../services/c2link4DiService");

const content_id = "recruit";

/**
 * 募集/予定一覧の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = async(req, res, next)=>{
	const render_obj = res.render_obj;
	const user_type = sessionHelper.getUserType(req);
	render_obj.title = c2Util.getRecruitListTitle(user_type);
	render_obj.contentId = content_id;

	const data = { user_type: user_type };

	const recruitList = await recruitlistService.getRecruitList(data);
	console.log('recruitList: ', recruitList);
	render_obj.bodyData = new vo_recruitlist.recruit_list_page(recruitList);
	res.render('recruitList/index', render_obj);
};

/**
 * 募集/予定一覧の表示(検索/ページャー)
 *
 * @param {*} req
 * @param {*} res
 */
exports.getSearchRecruit = async(req, res, next)=>{

	console.log("search param", req.form_data);

	const render_obj = res.render_obj;
	const user_type = sessionHelper.getUserType(req);

	const recruit_search_info = req.form_data;

	render_obj.title = c2Util.getRecruitListTitle(user_type);
	render_obj.contentId = content_id;

	const search_param = Object.assign(recruit_search_info, {
		date_key: dateHelper.getDate(),
		user_type: user_type,
	});

	const recruit_list = await recruitlistService.getRecruitList(search_param);
	render_obj.bodyData = new vo_recruitlist.recruit_list_page(recruit_list, recruit_search_info);
	res.render('recruitList/index', render_obj);
};

/**
 * 募集/予定一覧の表示(当日のみ)
 *
 * @param {*} req
 * @param {*} res
 */
exports.indexToday = async(req, res, next)=>{
	const render_obj = res.render_obj;
	const user_type = sessionHelper.getUserType(req);

	const recruit_search_info = {
		search_date_from: dateHelper.getDate().startOf('day'),
		search_date_to: dateHelper.getDate().startOf('day'),
	};

	render_obj.title = c2Util.getRecruitListTitle(user_type) + " (当日)";
	render_obj.contentId = content_id + "Today";

	const search_param = Object.assign(recruit_search_info, {
		date_key: dateHelper.getDate(),
		user_type: user_type,
	});

	const recruit_list = await recruitlistService.getRecruitList(search_param);
	render_obj.bodyData = new vo_recruitlist.recruit_list_page(recruit_list, recruit_search_info);
	res.render('recruitList/index', render_obj);
};

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
  });

};
