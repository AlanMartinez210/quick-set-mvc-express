/**
 * 対象の値がオブジェクトならtrue、それ以外ならfalseを返します。
 */
exports.isObject = (value) => {
	return value !== null && typeof value !== 'undefined' && Object(value) === value;
}