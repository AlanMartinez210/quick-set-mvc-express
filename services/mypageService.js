const db = require("../models/index");



const c2link4DiService = require("../services/c2link4DiService");

/**
 * 未レビューの数を取得します。
 *
 * @return {Number}
 */
exports.getNoReviewNum = async(user_id) => {
	return db.Matching.getNoReviewNum(user_id);
};

/**
 * 未確認のマッチング一覧の数を取得します
 *
 * @return {Number}
 */
exports.getMatchingRequestNum = async(user_id) => {
	return db.Matching.getPendingNum(user_id);
};
