

/** お問い合わせフォーム */
exports.postContact = {
	user_id: {
		in: 'body'
  },
  contact_email: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
		isEmail: { errorMessage: 'E00003' },
  },
  contact_type: {
		in: 'body',
		isEmpty: { errorMessage: 'E00005', negated: true },
  },
  contact_text: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
	}
}

/** パスワードの再発行フォーム */

exports.forgetPassword = {
	forget_user_id: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
  },
  forget_email: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
		isEmail: { errorMessage: 'E00003' },
  },
}

/** アカウントの復旧フォーム */

exports.forgetUserId = {
  forget_email: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
		isEmail: { errorMessage: 'E00003' },
  },
}