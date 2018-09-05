var scheduleRepository = require("../repository/scheduleRepository");
var recruitDetailForm = require("../form/recruitDetailForm");

/**
 * 募集の詳細ページ
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "recruit_detail";
	render_obj.title = "";
	render_obj.headerData = {
		bgImage : "xx",
	};
	render_obj.bodyData = row;
	res.render('recruitList/detail',render_obj);
}
