var userRepository = require("../repository/userRepository");
var loginService = require("../services/loginService");


/**
 * ログイン
 * ID/PWでログイン
 **/
exports.postLoginIDPW = function(req, res, next){
	console.log( "---- login -----");
	loginService.loginByIDPW(req)
	.then(result=>{
		res.json({success:'success'});
	}).catch(err=>{
		next(err);
	})
}
