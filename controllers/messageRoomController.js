const sessionHelper = require('../common/helper/sessionHelper');

const messageService = require('../services/messageService');
const messageRoomVO = require("../viewObjects/messageRoom");

/**
 * チャットルームの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = (req, res, next)=>{
	var render_obj = res.render_obj;
	render_obj.title = "メッセージルーム";
	render_obj.contentId = "messageRoom";

	const matching_id = req.form_data.r;
	const user_id = sessionHelper.getUserId(req);
	messageService.getMessageList(matching_id, user_id)
	.then(messageList=>{
		render_obj.bodyData = new messageRoomVO.messageList(messageList);
		res.render('message/room', render_obj);
	}).catch(next);
}

/**
 *  チャットで発言する
 *
 * @param {*} req
 * @param {*} res
 */
exports.postMessage = (req, res, next)=>{
	const matching_id = req.form_data.matching_id;
	const user_id = sessionHelper.getUserId(req);
	const message = req.form_data.message;
	messageService.postMessage(user_id, matching_id, message)
	.then(row=>{
		res.json({success:"success"});
	}).catch(next);
};
