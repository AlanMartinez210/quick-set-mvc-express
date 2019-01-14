/** チャット発言フォーム */
module.exports = {
	matching_id: {
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
