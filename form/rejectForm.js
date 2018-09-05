/** 依頼を却下フォーム */
module.exports = {
	request_id: {
		in: 'body',
		exists: {
      errorMessage: 'L00003',
		},
	},
}
