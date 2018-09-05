/**
 * サイト設定ページの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "site";
	render_obj.title = "サイト設定";
	res.render('mypage/site', render_obj);
}
