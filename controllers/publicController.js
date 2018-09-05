/**
 * publicControllerはログイン処理に関係しないアクセス処理を定義します。
 *
 */

/**
 * 利用者様のデータについての表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.getAdminInfo = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "about_user_data";
	render_obj.title = "利用者様のデータについて";
	render_obj.bodyData = {
	};
	res.render('public/aboutUserData',render_obj);
}

/**
 * 運営情報の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.getPrivacyPolicy = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "admin_info";
	render_obj.title = "運営情報";
	render_obj.bodyData = {
	};
	res.render('public/adminInfo',render_obj);
}

/**
 * お問い合わせ画面の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.getContact = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "contact";
	render_obj.title = "お問い合わせ";
	render_obj.bodyData = {
	};
	res.render('public/contact',render_obj);
}

/**
 * プライバシーポリシーの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.getPrivacyPolicy = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "privacy_policy";
	render_obj.title = "プライバシーポリシー";
	render_obj.bodyData = {
	};
	res.render('public/privacyPolicy',render_obj);
}
