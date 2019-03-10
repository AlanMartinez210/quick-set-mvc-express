

/** お問い合わせフォーム */
exports.postContact = {
	user_id: {
		in: 'body'
  },
  contact_email: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
  },
  contact_type: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
  },
  contact_text: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	}
}