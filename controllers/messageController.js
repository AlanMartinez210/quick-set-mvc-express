const messageService = require("../services/messageService");
const messageViewObjects = require("../viewObjects/message");

const matchingPattern = require('./matchingPattern');
const basePattern = require('./basePattern');


/**
 * 新着メッセージ一覧
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	var render_obj = res.render_obj;
	render_obj.title = "メッセージ一覧";
	render_obj.contentId = "message";

	messageService.getNewMessageList(req)
	.then(results=>{

		render_obj.bodyData = new messageViewObjects.newMessageList({
			send_date_info = results ,
			user_name = "",
			summary = ""
		});

		.newMessages = results;
		res.render('message', render_obj);
	})
	.catch(err=>{
		next(err);
	});

}
