const _ = require("lodash");

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
	allow_recruit_flg: {
		in: 'body',
	}
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
	remarks: common.remarks,
	allow_recruit_flg: common.allow_recruit_flg
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
	costume_field:{
		in: 'body',
		isArray:{ errorMessage: 'E00006' },
		isEmpty: { errorMessage: 'E00002', negated: true },
	},
	time_from: common.time_from,
	time_to: common.time_to,
	event_name: Object.assign({ isEmpty: { errorMessage: 'E00002', negated: true } }, common.event_name),
	remarks: common.remarks,
	allow_recruit_flg: common.allow_recruit_flg,
	self_payment_flg: {
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

/** 予定の更新 (カメラマン) */
exports.putByCam = {
	schedule_id:{
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	},
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
	remarks: common.remarks,
	allow_recruit_flg: common.allow_recruit_flg
};

/** 募集の更新 (コスプレイヤー) */
exports.putByCos = {
	schedule_id:{
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	},
	date_key: common.date_key,
	shot_type: common.shot_type,
	prefecture: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
	},
	costume_field:{
		in: 'body',
		isArray:{ errorMessage: 'E00006' },
		isEmpty: { errorMessage: 'E00002', negated: true },
	},
	tag_field: common.tag_field,
	time_from: common.time_from,
	time_to: common.time_to,
	event_name: Object.assign({ isEmpty: { errorMessage: 'E00002', negated: true } }, common.event_name ),
	remarks: common.remarks,
	allow_recruit_flg: common.allow_recruit_flg,
	self_payment_flg: {
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

/** ユーザー情報取得 */
exports.getScheduleData = {
  schedule_id: { 
    in: 'params',
    isEmpty: { errorMessage: 'fatal', negated: true },
  },
}

/** 予定/募集の削除 (カメラマン/コスプレイヤー) */
exports.delete = {
	schedule_id:{
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	}
};
