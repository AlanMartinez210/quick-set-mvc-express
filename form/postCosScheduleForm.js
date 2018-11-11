
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
	prefecture: {
		in: 'body',
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
			errorMessage: 'E00011,50',
			options:{ max: 50 },
		}
	},
	remarks:{
		in: 'body',
		isLength: {
			errorMessage: 'E00011,255',
			options:{ max: 255 },
		}
	},
	cos_chara:{
		in: 'body',
	},
	cost:{
		in: 'body',
		isInt: {
			options: {gt: 0, lt: 50},
			errorMessage: 'E00011,50'
		}
	},
	event_url:{
		in: 'body',
		isLength: {
			options:{ max: 255 },
			errorMessage: 'E00011,255',
		}
	},
	num: {
		in: 'body',
		isInt: {
			options: {gt: 0, lt: 50},
			errorMessage: 'E00011,50'
		}
	}

};
