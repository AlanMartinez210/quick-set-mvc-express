/** 募集のブックマークフォーム */
module.exports = {
	schedule_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	},
	mode: {
		in: 'body',
		isIn: {
			errorMessage: 'E00008',
			options: [['1','0']],
		},
		isEmpty: {
			errorMessage: `E00008`,
			negated: true
		}
	},
}
