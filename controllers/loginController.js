var userRepository = require("../repository/userRepository");
var loginService = require("../services/loginService");

const sessionHelper = require('../common/helper/sessionHelper');
const hashHelper = require("../common/helper/hashHelper");


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
