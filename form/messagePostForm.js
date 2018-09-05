/** 新規登録フォーム */
module.exports = {
	request_id: {
		in: 'body',
		exists: {
      errorMessage: 'E00001',
		},
	},
  message: {
		in: 'body',
		isLength: {
      errorMessage: 'message is required',
      options: { min: 1 }
		}
	},
}
