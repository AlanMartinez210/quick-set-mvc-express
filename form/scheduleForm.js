
/** 予定の作成 (カメラマン/コスプレイヤー) */
module.exports = {
	date_key: {
		in: 'body',
		isLength: {
			errorMessage: 'E00007',
			options:{min:8, max:8},
		}
	},
	shot_type: {
		in: 'body',
	},
	prefectures: {
		in: 'body',
		isArray:{
			errorMessage: 'prefectures must be array',
		}
	},
	tags: {
		in: 'body',
		isArray:{
			errorMessage: 'tags must be array',
		}
	},
	time_from: {
		in: 'body',
	},
	time_to: {
		in: 'body',
	},
	event_name: {
		in: 'body',
	},
	remarks:{
		in: 'body',
	},


	/* vvv コスプレイヤー vvv */
	cos_chara:{
		in: 'body',
	},
	cost:{
		in: 'body',
	},
	event_url:{
		in: 'body',
	},
	num: {
		in: 'body',
	},
	/* ^^^ コスプレイヤー ^^^ */

};
