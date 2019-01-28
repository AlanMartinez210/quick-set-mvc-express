exports.getMatchingHistory = {
	page: {
		in: 'query',
	}
}

/** 依頼を却下フォーム */
exports.postConsent = {
	matching_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	},
}

/** 依頼を却下フォーム */
exports.postReject = {
	matching_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	},
}

/** 依頼/応募をするフォーム */
exports.postReqest = {
	schedule_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true }
	},
};
