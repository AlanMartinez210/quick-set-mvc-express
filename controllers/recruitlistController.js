const dateHelper = require('../common/helper/dateHelper');
const sessionHelper = require('../common/helper/sessionHelper');
const recruitlistService = require('../services/recruitlistService');
const vo_recruitlist = require("../viewObjects/recruitlist");
const c2Util = require("../services/c2link4DiService");

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

		// テストデータ
		results.rows = [
      {
				id: 60,
				user_id: 1,
				user_icon_url: "./image/icon.png",
				date_key: dateHelper.getDate(), // moment
				shot_type: [1, "イベント"],
				event_name: "世界コスプレサミット",
				prefectures: [
					{id: 13, name: "東京都"},
					{id: 15, name: "神奈川県"},
				],
        good_review_num: 13,
        bookmark_flg: true,
        tags: [
          {id: 1, name: "一眼あり"},
          {id: 2, name: "データ渡し2週間以内"},
          {id: 3, name: "夜間撮影OK"}
        ]
			},
			{
				id: 61,
				user_id: 1,
				user_icon_url: "./image/icon.png",
				date_key: dateHelper.getDate(), // moment
				shot_type: [3, "個人撮影"],
				event_name: "世界コスプレサミット",
				prefectures: [
					{id: 13, name: "東京都"},
					{id: 15, name: "神奈川県"},
				],
        good_review_num: 13,
        bookmark_flg: false,
        tags: [
          {id: 1, name: "一眼あり"},
          {id: 2, name: "データ渡し2週間以内"},
          {id: 3, name: "夜間撮影OK"}
        ]
      }
  	];

		render_obj.bodyData = new vo_recruitlist.recruit_list_page({
			recruit_list_item: results.rows.map(row=>{
				return new vo_recruitlist.recruit_list_item({
					recruit_list_id: row.id,
					user_info: {id: row.user_id, icon: row.user_icon_url},
					date_info: row.date_key,
					event_info: {
						type: row.shot_type,
						title: row.event_name,
						prefectures: row.prefectures
					},
					good_review_num: row.good_review_num,
					bookmark_flg: row.bookmark_flg,
					tags: row.tags,
					anime_info: []
				});
			}),
			recruit_list_pager: results.pages,
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

	const data = {
		date_key: dateHelper.getDate(),
		user_type: user_type,
		page: 1,
	};

	renderRecruitList(data, render_obj)
	.then(()=>{
		res.render('recruitList/index', render_obj);
	})
	.catch(next);
}

/**
 * 募集/予定一覧の表示(検索結果)
 *
 * @param {*} req
 * @param {*} res
 */
exports.getSearchRecruit = function(req, res, next){
	console.log("search param", req.form_data);
	const render_obj = res.render_obj;
	const user_type = sessionHelper.getUserType(req);

	render_obj.title = c2Util.getRecruitListTitle(user_type);
	render_obj.contentId = content_id;

	const data = {
		date_key: dateHelper.getDate(),
		user_type: sessionHelper.getUserType(req),
		page: req.form_data.page,
	};

	// 日付をmomentに変換する。
	data.date_key = req.form_data.date_key ? dateHelper.getDate(req.form_data.date_key) : undefined;

	renderRecruitList(data, render_obj)
	.then(()=>{
		res.render('../content/recruitlist/recruitlist', render_obj);
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

	const data = {
		user_type: sessionHelper.getUserType(req),
		date_key: dateHelper.getDate(),
		page: 1,
	};

	renderRecruitList(data, render_obj)
	.then(()=>{
		res.render('recruitList/index', render_obj);
	})
	.catch(next);
}