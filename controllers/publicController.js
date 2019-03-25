/**
 * publicControllerはログイン処理に関係しないアクセス処理を定義します。
 */

const noticeVO = require("../viewObjects/notice");
const publicService = require("../services/publicService");
const sessionHelper = require('../common/helper/sessionHelper');
const mailHelper = require('../common/helper/mailHelper');
const c2Util = require("../services/c2link4DiService");
const common_env = require("../config/env.json").common;

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
	render_obj.backBtn = c2Util.getBackMypageBtn();

	render_obj.bodyData = {};
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
	render_obj.backBtn = c2Util.getBackMypageBtn();

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
	render_obj.backBtn = c2Util.getBackMypageBtn();

	res.render('public/aboutUserData',render_obj);
}


/**
 * お問い合わせ画面の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.postContact = (req, res, next) => {
	const contactData = req.form_data;
	const sendData = {};
	contactData.contact_type = c2Util.enumContactType().getName(contactData.contact_type);

	sendData.from_address = common_env.CONTACT_MAIL;
	sendData.to_address = contactData.contact_email;
	sendData.subject = '【c2link】お問い合わせ';
	sendData.mail_text = `
    ■お問い合わせ種別：<br>${contactData.contact_type}<br>
    ■問い合わせ内容：<br>${contactData.contact_text}<br>
    ■ユーザーID：<br>${contactData.user_id}`;

	mailHelper.send(common_env.MAIL_SETTING, sendData);
	res.json({status:'success'});
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
	render_obj.backBtn = c2Util.getBackMypageBtn();
	
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
		const notice_list = results.notice_list.map(item => new noticeVO.notice_list_item(item));
		const notice_list_pager = results.pages;

		render_obj.bodyData = new noticeVO.notice_obj({
			notice_list,
			notice_list_pager
		});
		
    res.render('../modal/notice', render_obj);
  })
  .catch(err => {
    next(err);
  })
}
