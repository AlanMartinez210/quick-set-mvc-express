var userRepository = require("../repository/userRepository");
var registerService = require("../services/registerService");
var sessionHelper = require('../common/helper/sessionHelper');


/**
 * 新規登録画面の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = (req, res, next) => {
	const render_obj = res.render_obj;
	render_obj.contentId = "register";
	render_obj.title = "新規登録";
	res.render('register', render_obj);
}

/**
 * 新規登録ユーザーの作成
 *
 * @param {*} req
 * @param {*} res
 */
exports.postCreateUser = (req, res, next) => {
	registerService.registerUser(req)
	.then(user=>{
		console.log("------ registered ---------", user);
		sessionHelper.setUserData(req, user, ()=>{
			console.log("------ session ---------", req.session);
			res.status(200).json({success:"success"});
		});
	}).catch(next);
}
