/** ログインフォーム */
module.exports = {
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
		}
	},
}
