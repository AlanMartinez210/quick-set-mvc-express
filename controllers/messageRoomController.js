const c_MessageRepository = require('../repository/CustomRepository/messageRepository');
/**
 * チャットルームの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = (req, res, next)=>{
	var render_obj = res.render_obj;
	render_obj.title = "メッセージルーム";
	render_obj.contentId = "room";
	render_obj.bodyData.messages = [
		{user_id:999998, message:'aaaa'},
		{user_id:999999, message:'bbbbb'},
	];
	res.render('message/room', render_obj);
}

/**
 *  チャットで発言する
 *
 * @param {*} req
 * @param {*} res
 */
exports.postMessage = (req, res, next)=>{
	c_MessageRepository.postMessage(req)
	.then(row=>{
		res.json({success:"success"});
	})
	.catch(next);
};
