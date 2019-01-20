/** レビューの送信フォーム */
exports.postReview = {
	select_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true }
	},
	review_type: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	review_comment: {
		in: 'body',
		isLength: {
			errorMessage: 'E00011,255',
			options:{ max: 255 },
		}
	},
}
