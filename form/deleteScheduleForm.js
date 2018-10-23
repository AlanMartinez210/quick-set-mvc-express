
/** 予定の作成 (カメラマン/コスプレイヤー) */
module.exports = {
	schedule_id:{
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	}
};
