
/** 予定の作成 (カメラマン/コスプレイヤー) */
module.exports = {
	schedule_id:{
		in: 'body'
	},
	date_key: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
	},
	shot_type: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
	},
	prefectures_field: {
		in: 'body',
		isArray:{ errorMessage: 'E00006' },
		isEmpty: { errorMessage: 'E00002', negated: true },
	},
	tag_field: {
		in: 'body',
		isArray:{ errorMessage: 'E00006' }
	},
	time_from: {
		in: 'body',
	},
	time_to: {
		in: 'body',
	},
	event_name: {
		in: 'body',
		isLength: {
			errorMessage: 'E00011',
			options:{ max: 50 },
		}
	},
	remarks:{
		in: 'body',
		isLength: {
			errorMessage: 'E00011',
			options:{ max: 255 },
		}
	}

};
