/** 新規登録フォーム */
module.exports = {
	user_name: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	password: {
		in: 'body',
		isLength: {
      errorMessage: 'E00004',
      options: { min: 7 }
		},
		matches: {
			errorMessage: 'E00004',
			options: '^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$',
			negated: true,
		},
	},
	email: {
		in: 'body',
		isEmail: {
			errorMessage: 'E00003',
		},
	},
	user_type: {
		in: 'body',
		isIn: {
			errorMessage: 'E00006',
			options: [['1','2']],
		},
		isEmpty: { errorMessage: `E00005`, negated: true }
	}
}
