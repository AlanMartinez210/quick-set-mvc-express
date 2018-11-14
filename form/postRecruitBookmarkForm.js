/** 募集のブックマークフォーム */
module.exports = {
	schedule_id: {
		in: 'body',
		isEmpty: {
			errorMessage: `E00008`,
			negated: true
		}
	},
	mode: {
		in: 'body',
		isIn: {
			errorMessage: 'E00008',
			options: [['1','2']],
		},
		isEmpty: {
			errorMessage: `E00008`,
			negated: true
		}
	},
}
