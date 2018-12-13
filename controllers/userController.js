const userService = require("../services/userService");
const generalVO = require("../viewObjects/general");
const db = require("../models/index");
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
	return userService.createUser(req.form_data)
		.then(user => {
			sessionHelper.setUserData(req, user, () => {
				res.status(200).json({
					success: "success"
				});
			});
		})
		.catch(err => {
			next(err);
		});
}

/**
 * アカウントの削除
 **/
exports.postUserDelete = function (req, res, next) {
	const user_id = sessionHelper.getUserId(req);
	// ログインしているユーザーデータを取得
	return userService.getloginUserData(user_id, req.form_data.password)
		.then(user_data => {
			// 有効期限を設定し、セッション情報を削除します。
			return db.User.deleteUser(user_data.id)
		})
		.then(() => {
			sessionHelper.deleteSession(req);
			res.status(200).json({
				success: "success"
			});
		})
		.catch(err => {
			next(err);
		});
}


/**
 * ログイン
 **/
exports.postLogin = function (req, res, next) {
	const login_key = req.form_data.login_key;
	const password = req.form_data.login_password;
	return userService.getloginUserData(login_key, password)
		.then(user_data => {
			user_data = user_data.toJSON();
			if (!user_data.expiration_date) return user_data;

			// 取得したユーザーが有効期限を保持し、且つ期限内なら有効期限を破棄する。
			return userService.checkExpirationDate(user_data.expiration_date)
				.then(() => userService.clearExpirationDate(user_data.id))
				.then(() => user_data)

		})
		.then(user_data => {
			// セッションにデータを格納する。
			sessionHelper.setUserData(req, user_data);
			res.status(200).json({
				success: "success"
			});
		})
		.catch(err => {
			next(err);
		});
}

/**
 * ログアウト
 **/
exports.postLogout = function (req, res, next) {
	// セッションデータを破棄する。
	sessionHelper.deleteSession(req);
	res.status(200).json({
		success: "success"
	});
}

/**
 * ユーザー情報の取得
 */
exports.getUserData = (req, res, next) => {
	// ユーザーID(user_key)
	const user_id = req.form_data.user_id;
	console.log('user_id: ', user_id);

	db.User.getUserByKey(user_id)
	.then(instance => {
		console.log('instance: ', instance);
		res.json(new generalVO.userInfo(instance))
	})
	.catch(err=>{
    next(err);
  });
}