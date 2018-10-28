var scheduleRepository = require("../repository/scheduleRepository");
var recruitDetailForm = require("../form/recruitDetailForm");

/**
 * 募集の詳細ページ
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	var render_obj = res.render_obj;
	render_obj.contentId = "recruit_detail";
	render_obj.title = "募集詳細";
	render_obj.bodyData = {};
	res.render('recruitList/detail', render_obj);
}

/**
 * 募集の詳細ページ(外部アクセス)
 * 
 * @param {*} req
 * @param {*} res
 */
exports.entryOutSide = function(req, res){

}
