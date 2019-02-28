const sessionHelper = require('../common/helper/sessionHelper');

const messageService = require("../services/messageService");
const messageViewObjects = require("../viewObjects/message");


/**
 * 新着メッセージ一覧
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	const render_obj = res.render_obj;
	render_obj.title = "メッセージ一覧";
	render_obj.contentId = "message";
	const user_id = sessionHelper.getUserId(req);
	// reqでとらない
	messageService.getNewMessageList(user_id)
	.then(results=>{

		render_obj.bodyData = new messageViewObjects.newMessageList({
			send_date_info: results ,
			user_name: "",
			summary: ""
		});

		render_obj.newMessages = results;
		res.render('message', render_obj);
	})
	.catch(err=>{
		next(err);
	});

}
