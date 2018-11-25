/**
 * 対象の値がオブジェクトならtrue、それ以外ならfalseを返します。
 */
exports.isObject = (value) => {
	return value !== null && typeof value !== 'undefined' && Object(value) === value;
}

/**
 * 半角数字チェック
 */
exports.isNumber = (value) => {
	const p = /^([1-9]\d*|0)$/;
	return p.test(value);
}

/* ログインしている状態かどうか
 * @param {*} req
 */
exports.isLogin = function(req){
	return (req.session.user && req.session.user.id);
}
