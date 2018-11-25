const userService = require("../services/userService");

const sessionHelper = require('../common/helper/sessionHelper');
const isHelper = require('../common/helper/isHelper');

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
	if(isHelper.isLogin(req)){
		res.redirect('/');
		return;
	}
	res.render('register', render_obj);
}

/**
 * 新規登録ユーザーの作成
 *
 * @param {*} req
 * @param {*} res
 */
exports.postRegister = (req, res, next) => {
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
 * アカウントの削除
 **/
exports.postUserDelete = function(req, res, next){
	const user_id = sessionHelper.getUserId(req);
	const password = req.form_data.password;
	// ログインしているユーザーデータを取得
	return userService.getloginUserData(user_id, password)
	.then(user_data => {
		// 有効期限を設定し、セッション情報を削除します。
		return userService.setExpirationDate(user_data.id)
	})
	.then(result => {
		sessionHelper.deleteSession(req);
		res.status(200).json({success:"success"});
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
	const password = req.form_data.login_password;
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

/**
 * ログアウト
 **/
exports.postLogout = function(req, res, next){
	// セッションデータを破棄する。
	sessionHelper.deleteSession(req);
	res.status(200).json({success:"success"});
}
