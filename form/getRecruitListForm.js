const dateHelper = require('../common/helper/dateHelper');
/** 募集を検索フォーム */
module.exports = {
	type:{
		in: 'params',
		isIn: {
			errorMessage: "E00017",
			options: [['every', 'today']]
		} 
	}
};
