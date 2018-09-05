const c_messageRepository = require("../repository/CustomRepository/messageRepository");

/**
 * メッセージ一覧ページの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	var render_obj = res.render_obj;
	render_obj.title = "メッセージ一覧";
	render_obj.contentId = "message";

	c_messageRepository.getNewMessageList(req)
	.then(results=>{
		render_obj.bodyData.newMessages = results;
		res.render('message', render_obj);
	})
	.catch(err=>{
		next(err);
	});

}
