/**
 * プライバシーポリシーの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "privacy_policy";
	render_obj.title = "プライバシーポリシー";
	render_obj.bodyData = {
	};
	res.render('mypage/privacyPolicy',render_obj);
}
