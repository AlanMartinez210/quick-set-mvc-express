/** 依頼を承諾フォーム */
module.exports = {
	request_id: {
		in: 'body',
		exists: {
      errorMessage: 'L00003',
		},
	},
}
