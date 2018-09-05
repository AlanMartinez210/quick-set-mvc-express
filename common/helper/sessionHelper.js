/**
 * セッション内にユーザー情報をセットします。
 *
 * @param {*} req
 * @param {*} userObj
 */
exports.setUserData = function(req, userObj, callback){
	req.session.user = {
		id: userObj.id,
		user_name: userObj.user_name,
		email: userObj.email,
		user_type: userObj.user_type,
	};
	req.session.save(callback);
};

/**
 * セッション内のユーザー情報をすべて取得します。
 *
 * @param {*} req
 */
exports.getUserData = function(req){
	return req.session.user;
}

/**
 * セッション内のユーザー情報からユーザーIDを取得します。
 * @param {*} req
 */
exports.getUserId = function(req){
	return req.session.user.id;
}

/**
 * セッション内のユーザー情報からユーザー種別を取得します。
 * @param {*} req
 */
exports.getUserType = function(req){
	return req.session.user.user_type;
}
