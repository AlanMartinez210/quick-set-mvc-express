const dateHelper = require('../common/helper/dateHelper');
/** 募集を検索フォーム */
module.exports = {
	type:{
		in: 'params',
		custom: {
			errorMessage: 'E00015',
			options: value =>{
				return value === "every" || value === "today"
			}
		}
	}
};
