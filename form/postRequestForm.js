/** 依頼するフォーム */
module.exports = {
	schedule_id: {
		in: 'body',
		exists: {
      errorMessage: 'err',
		},
	},
};
