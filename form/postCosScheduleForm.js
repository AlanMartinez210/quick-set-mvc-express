const _ = require("lodash");

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
		},
		isEmpty: { errorMessage: 'E00002', negated: true },
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
	event_url:{
		in: 'body',
		isLength: {
			options:{ max: 255 },
			errorMessage: 'E00011,255',
		}
	},
	num: {
		in: 'body',
		custom: {
			errorMessage: 'E00011,半角数字,50',
			options: value =>{
				// 値が存在する時に日付形式チェックをする
				return value ? _.isNumber(Number(value)) : true;
			}
		}
	},
	cost:{
		in: 'body',
		custom: {
			errorMessage: 'E00011,半角数字,50',
			options: value =>{
				// 値が存在する時に日付形式チェックをする
				return value ? _.isNumber(Number(value)) : true;
			}
		}
	}
};
