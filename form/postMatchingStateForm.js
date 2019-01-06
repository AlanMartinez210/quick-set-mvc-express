/** 依頼を却下フォーム */
module.exports = {
	matching_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	},
}
