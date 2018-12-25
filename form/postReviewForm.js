/** レビューの送信フォーム */
module.exports = {
	select_id: {
		in: 'body',
		exists: {
			errorMessage: 'L00004',
		},
	},
	review_type: {
		in: 'body',
		exists: {
			errorMessage: 'L00004',
		},
	},
	review_comment: {
		in: 'body',
		exists: {
			errorMessage: 'L00004',
		},
	},
}
