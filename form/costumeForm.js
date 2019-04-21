const _ = require("lodash");

/**
 * コスチューム情報の取得
 */
exports.getCostume = {
	costume_id: {
		in: 'params',
		isEmpty: { errorMessage: 'fatal', negated: true }
	}
}

/**
 * コスプレ衣装の新規登録
 */
exports.post = {
	conf_chara_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true }
	},
	costume_comment: {
		in: 'body'
	}
}

/**
 * コスプレ衣装の更新
 */
exports.put = {
	costume_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true }
	},
	costume_comment: {
		in: 'body'
	}
}

/**
 * コスプレ衣装の削除
 */
exports.delete = {
	costume_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true }
	}
}

