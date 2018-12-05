/**
 * publicControllerはログイン処理に関係しないアクセス処理を定義します。
 */

const noticeVO = require("../viewObjects/notice");
const publicService = require("../services/publicService");
const sessionHelper = require('../common/helper/sessionHelper');

const db = require("../models/index");


/**
 * 運営情報の表示
 *
 * @param {*} req
 * @param {*} res
 */
 exports.getAdminInfo = (req, res, next) => {
	var render_obj = res.render_obj;
	render_obj.contentId = "admin_info";
	render_obj.title = "運営情報";
	render_obj.bodyData = {
	};
	res.render('public/adminInfo',render_obj);
}

/**
 * プライバシーポリシーの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.getPrivacyPolicy = (req, res, next) => {
	var render_obj = res.render_obj;
	render_obj.contentId = "privacy_policy";
	render_obj.title = "プライバシーポリシー";
	render_obj.bodyData = {
	};
	res.render('public/privacyPolicy',render_obj);
}


/**
 * 利用者様のデータについての表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.getAboutUserData = (req, res, next) => {
	var render_obj = res.render_obj;
	render_obj.contentId = "about_user_data";
	render_obj.title = "利用者様のデータについて";
	render_obj.bodyData = {
	};
	res.render('public/aboutUserData',render_obj);
}


/**
 * お問い合わせ画面の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.getContact = (req, res, next) => {
	var render_obj = res.render_obj;
	render_obj.contentId = "contact";
	render_obj.title = "お問い合わせ";
	render_obj.bodyData = {
	};
	res.render('public/contact',render_obj);
}

exports.getNoticeData = (req, res, next) => {
	const render_obj = res.render_obj;
	const user_id = sessionHelper.getUserId(req);

	const data = {
		islogin: true,
		target_year: 2018,
		now_page: req.query.p,
	}

  publicService.getNoticeList(db, data)
  .then(results => {
		const notice_list_item = results.notice_list.map(item => {
			return new noticeVO.notice_list_item({
				id: item.id,
				notice_date: item.notice_date,
				type: item.type,
				title: item.title,
				content: item.content
			});
		});

		const notice_list_pager = results.pages;

		render_obj.bodyData = new noticeVO.notice_list({
			notice_list_item,
			notice_list_pager
		});

    res.render('../modal/notice', render_obj);
  })
  .catch(err => {
    next(err);
  })
}
