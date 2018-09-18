var userRepository = require("../repository/userRepository");
var loginService = require("../services/userService");

const sessionHelper = require('../common/helper/sessionHelper');
const hashHelper = require("../common/helper/hashHelper");

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
	return registerService.registerUser(req.form_data)
	.then(user=>{
		console.log("------ registered ---------", user);
		sessionHelper.setUserData(req, user, ()=>{
			console.log("------ session ---------", req.session);
			res.status(200).json({success:"success"});
		});
	}).catch(next);
}

/**
 * ログイン
 * ID/PWでログイン
 **/
exports.postLoginIDPW = function(req, res, next){
	const user_key  = req.form_data.user_key;
	const password = hashHelper(req.form_data.password);
	return loginService.loginByIDPW(user_key, password)
	.then(user=>{
		sessionHelper.setUserData(req, user);
		res.json({success:'success'});
	}).catch(err=>{
		next(err);
	});
}


