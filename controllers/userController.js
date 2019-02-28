const userService = require("../services/userService");
const generalVO = require("../viewObjects/general");
const db = require("../models/index");
const sessionHelper = require('../common/helper/sessionHelper');
const multer = require('multer');

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
	const user_key = req.form_data.user_id;
	userService.getUserData(user_key)
	.then(instance => {
		res.json(new generalVO.userInfo(instance))
	})
	.catch(err => {
		next(err);
	});
}

/**
 * ユーザー情報更新
 */
exports.postUserUpdate = (req, res, next) => {
	const form_data = req.form_data;
	//ユーザーIDをセッションから取得
	const user_id = sessionHelper.getUserId(req);
	userService.updateProfileData(user_id, form_data)
	.then(() => {
		// ユーザー情報を再取得する。
		return userService.getUserDataById(user_id)
	})
	.then(instance => {
		res.json(new generalVO.userInfo(instance));
	})
	.catch(err => {
		next(err);
	});
}


/**
 * ユーザーアイコンの登録
 */
exports.postProfileIcon = (req, res, next) => {
	let imageUploader = multer({
		dest: `${__dirname}/../public/image/icons`,
		limits: {
			fileSize: 500000  // ファイルサイズ上限
		}
	}).any();

	imageUploader(req, res, err  => {
		if (err) { next(err); }
		console.log('req.files: ', req.files);
		const mimetype = req.files[0].mimetype
		const type = [
			{ ext: 'gif', mime: 'image/gif' },
			{ ext: 'jpg', mime: 'image/jpeg' },
			{ ext: 'png', mime: 'image/png' }
		].find(ext => {
			return ext.mime === mimetype
		})

		if (!type) {
			next(new errorHelper({ status: 400, code: "E00018" }))
			return false;
		}

		const user_id = sessionHelper.getUserId(req);
		//既存のicon情報を取得
		userService.registUserIcon(user_id, req.files[0].filename)
		.then(result => {
			imageUploader = null;
			res.json({ status: 'success' });
		})
		.catch(err => {
			next(err);
		});
	});
}

/**
 * カバー背景の登録
 */
exports.postBgCover = (req, res, next) => {
	let imageUploader = multer({
		dest: `${__dirname}/../public/image/covers`,
		limits: {
			fileSize: 3000000  // ファイルサイズ上限
		}
	}).any();

	imageUploader(req, res, err  => {
		if (err) { next(err); }
		console.log('req.files: ', req.files);
		const mimetype = req.files[0].mimetype
		const type = [
			{ ext: 'gif', mime: 'image/gif' },
			{ ext: 'jpg', mime: 'image/jpeg' },
			{ ext: 'png', mime: 'image/png' }
		].find(ext => {
			return ext.mime === mimetype
		})

		if (!type) {
			next(new errorHelper({ status: 400, code: "E00018" }))
			return false;
		}

		const user_id = sessionHelper.getUserId(req);
		//既存のicon情報を取得
		userService.registBgCover(user_id, req.files[0].filename)
		.then(result => {
			imageUploader = null;
			res.json({ status: 'success' });
		})
		.catch(err => {
			next(err);
		});
	});
}

