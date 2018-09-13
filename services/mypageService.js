const c_reviewRepository = require('../repository/CustomRepository/ReviewRepository');
const matchingRepository = require('../repository/matchingRepository')();

/**
 * 未レビューの数を取得します。
 *
 * @return {Number}
 */
exports.getNoReviewNum = async(user_id) => {
	const result = await c_reviewRepository.getUnReviewListCount({user_id});
	return result[0].cnt;
};

/**
 * 自分当てのマッチングの中でマッチングステータスが、保留中の数を取得します。
 *
 * @return {Number}
 */
exports.getMatchingRequestNum = async(user_id) => {
	const result = await matchingRepository.count({
		where:{
			to_user_id: user_id,
			status_id: global.C2LINK.MATCHING_STATUS_ID_MAP.REQUEST,
		}
	});
	return result;
};
