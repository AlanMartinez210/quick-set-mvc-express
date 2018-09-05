/** ログインフォーム */
module.exports = {
	user_key: {
		in: 'body',
		isLength:{
			errorMessage: 'user_key should be at least 7 chars long',
			options: { min: 6 }
		}
	},
	password: {
		in: 'body',
		isLength:{
			errorMessage: 'password should be at least 7 chars long',
			options: { min: 6 }
		}
	},
}
