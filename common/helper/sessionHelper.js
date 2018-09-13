const isHelper = require('../helper/isHelper');

/**
 * セッション内にユーザー情報をセットします。
 *
 * @param {*} req
 * @param {*} userObj
 */
exports.setUserData = function(req, userObj, callback){
	if(!isHelper.isObject(req)) throw new Error('request object does not exist');
	if(!isHelper.isObject(userObj)) throw new Error('user object does not exist');
	req.session.user = {
		id: userObj.id,
		user_name: userObj.user_name,
		email: userObj.email,
		user_type: userObj.user_type,
	};
	if(callback) req.session.save(callback);
};

/**
 * セッション内のユーザー情報をすべて取得します。
 *
 * @param {*} req
 */
exports.getUserData = function(req){
	if(!isHelper.isObject(req)) throw new Error('request object does not exist');
	return req.session.user;
}

/**
 * セッション内のユーザー情報からユーザーIDを取得します。
 * @param {*} req
 */
exports.getUserId = function(req){
	if(!isHelper.isObject(req)) throw new Error('request object does not exist');
	return req.session.user.id;
}

/**
 * セッション内のユーザー情報からユーザー種別を取得します。
 * @param {*} req
 */
exports.getUserType = function(req){
	if(!isHelper.isObject(req)) throw new Error('request object does not exist');
	return req.session.user.user_type;
}
