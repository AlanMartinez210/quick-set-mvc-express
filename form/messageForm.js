
exports.getMessage = {
	r:{
		in: 'query',
	}
};


/** チャット発言フォーム */
exports.postMessage = {
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
