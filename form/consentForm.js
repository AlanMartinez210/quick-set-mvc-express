/** 依頼を承諾フォーム */
module.exports = {
	matching_id: {
		in: 'body',
		exists: {
      errorMessage: 'L00003',
		},
	},
}
