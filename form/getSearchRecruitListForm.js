const dateHelper = require('../common/helper/dateHelper');
/** 募集を検索フォーム */
module.exports = {
	type:{
		in: 'params',
		isIn: {
			errorMessage: "E00017",
			options: [['every', 'today']]
		},
		isEmpty: { errorMessage: 'fatal', negated: true }
	},
	search_date_from:{
		in: 'query',
		custom: {
			errorMessage: 'E00007',
			options: value =>{
				// 値が存在する時に日付形式チェックをする
				return value ? dateHelper.isValidString(value) : true;
			}
		}
	},
	search_date_to:{
		in: 'query',
		custom: {
			errorMessage: 'E00007',
			options: value =>{
				// 値が存在する時に日付形式チェックをする
				return value ? dateHelper.isValidString(value) : true;
			}
		}
	},
	prefectures_field:{
		in: 'query'
	},
	search_tag:{
		in: 'query'
	},
	shot_type:{
		in: 'query'
	}
};
