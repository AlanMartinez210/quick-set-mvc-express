const userService = require("../services/userService");

const sessionHelper = require('../common/helper/sessionHelper');

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
exports.postRegister = (req, res, next) => {
	console.log(req.form_data);
	return userService.createUser(req.form_data)
	.then(user=>{
		sessionHelper.setUserData(req, user, () => {
			res.status(200).json({success:"success"});
		});
	})
	.catch(err => {
		next(err);
	});
}


/**
 * ログイン
 **/
exports.postLogin = function(req, res, next){
	const login_key = req.form_data.login_key;
	const password = req.form_data.password;

	return userService.getloginUserData(login_key, password)
	.then(user_data =>{
		// 取得したユーザーが有効期限を保持していたら
		if(user_data.expiration_date){
			userService.checkExpirationDate(user_data.expiration_date)
			.then(result => {
				return userService.clearExpirationDate(user_data.id)
			})
		}
		return user_data;
	})
	.then(user_data => {
		// セッションにデータを格納する。
		sessionHelper.setUserData(req, user_data);
		res.status(200).json({success:"success"});
	})
	.catch(err => {
		next(err);
	});
}


