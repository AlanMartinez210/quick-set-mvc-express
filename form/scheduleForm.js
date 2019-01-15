const common = {
	schedule_id: { 
		in: 'body',
		isEmpty: { errorMessage: 'fatal' }
	},
	date_key: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
	},
	shot_type: {
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
	remarks:{
		in: 'body',
		isLength: {
			errorMessage: 'E00011,255',
			options:{ max: 255 },
		}
	},
	event_name: {
		in: 'body',
		isLength: {
			errorMessage: 'E00011,50',
			options:{ max: 50 },
		}
	},
};


/** 予定の作成 (カメラマン) */
exports.postByCam = {
	schedule_id: common.schedule_id,
	date_key: common.date_key,
	shot_type: common.shot_type,
	prefectures_field: {
		in: 'body',
		isArray:{ errorMessage: 'E00006' },
		isEmpty: { errorMessage: 'E00002', negated: true },
	},
	tag_field: common.tag_field,
	time_from: common.time_from,
	time_to: common.time_to,
	event_name: common.event_name,
	remarks: common.remarks

};

/** 予定の作成 (コスプレイヤー) */
exports.postByCos = {
	schedule_id: common.schedule_id,
	date_key: common.date_key,
	shot_type: common.shot_type,
	prefecture: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
	},
	tag_field: common.tag_field,
	time_from: common.time_from,
	time_to: common.time_to,
	event_name: Object.assign(common.event_name, { isEmpty: { errorMessage: 'E00002', negated: true } } ),
	remarks: common.remarks,
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