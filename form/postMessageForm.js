/** 新規登録フォーム */
module.exports = {
	request_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	},
	message: {
		in: 'body',
		isLength: {
			errorMessage: 'message is required',
			options: { min: 1 }
		}
	},
}
