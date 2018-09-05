/**
 * サンプル写真設定ページの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "sample_image";
	render_obj.title = "サンプル写真設定";
	res.render('mypage/sampleImage',render_obj);
}
