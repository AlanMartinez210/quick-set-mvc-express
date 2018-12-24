/** 依頼を却下フォーム */
module.exports = {
	matching_id: {
		in: 'body',
		exists: {
      errorMessage: 'L00003',
		},
	},
}
