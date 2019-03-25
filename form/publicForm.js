

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