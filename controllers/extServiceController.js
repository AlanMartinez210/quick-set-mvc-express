/**
 * 外部サービス連携の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "ext_service";
	render_obj.title = "外部サービス連携";
	render_obj.bodyData = {
	};
	res.render('mypage/extService',render_obj);
}
