module.exports = {
	schedule_id: {
		in: 'body',
		isEmpty: { 
			errorMessage: 'fatal',
			negated: true
		},
	},
};
