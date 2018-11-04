/** 募集を検索フォーム */
module.exports = {
	box_search_date:{
		in: 'body',
		isArray:{ errorMessage: 'E00006' }
	},
	prefectures_field:{
		in: 'body'
	},
	search_date_from:{
		in: 'body'
	},
	search_tag:{
		in: 'body'
	},
	shot_type:{
		in: 'body'
	},
	page: {
		in: 'body'
	},
};
