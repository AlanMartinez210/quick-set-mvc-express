const _ = require('lodash');

/**
 * セッション内にユーザー情報をセットします。
 *
 * @param {*} req
 * @param {*} userObj
 */
exports.setUserData = function(req, userObj, callback){
	if(!_.isObject(req)) throw new Error('request object does not exist');
	if(!_.isObject(userObj)) throw new Error('user object does not exist');
	req.session.user = {
		id: userObj.id,
		user_type: userObj.user_type,
	};
	if(callback) req.session.save(callback);
};

/**
 * セッションを破棄します。
 */
exports.deleteSession = function(req, callback = function(err){}){
	if(!_.isObject(req)) throw new Error('request object does not exist');
	if(req.session) req.session.destroy(callback);
};

/**
 * セッション内のユーザー情報をすべて取得します。
 *
 * @param {*} req
 */
exports.getUserData = function(req){
	if(!_.isObject(req)) throw new Error('request object does not exist');
	return req.session.user;
};

/**
 * セッション内のユーザー情報からユーザーIDを取得します。
 * @param {*} req
 */
exports.getUserId = function(req){
	if(!_.isObject(req)) throw new Error('request object does not exist');
	if(req.session.user) return req.session.user.id;

	return false;
};

/**
 * セッション内のユーザー情報からユーザー種別を取得します。
 * @param {*} req
 */
exports.getUserType = function(req){
	if(!_.isObject(req)) throw new Error('request object does not exist');
	if(req.session.user) return req.session.user.user_type;

	return false;
};

/* ログインしている状態かどうか
 * @param {*} req
 */
exports.isLogin = function(req){
	if(!_.isObject(req)) throw new Error('request object does not exist');
	return Boolean(req.session.user && req.session.user.id);
};
