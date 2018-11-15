/** 募集を検索フォーム */
module.exports = {
	search_date_from:{
		in: 'query',
		isLength: {
			errorMessage: 'E00008',
			options:{ min: 8, max: 8 },
		}
	},
	search_date_to:{
		in: 'query'
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
