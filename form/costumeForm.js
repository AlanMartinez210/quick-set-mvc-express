const _ = require("lodash");

/**
 * コスプレ衣装の新規登録
 */
exports.post = {
	conf_content_title: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	conf_content_chara: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
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

/**
 * 作品タイトルの検索
 */
exports.getSearchContentTilte = {
	search: {
		in: 'params'
	}
}

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
 * 作品タイトルの登録
 */
exports.postRegistTitle = {
  content_title: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	content_sub_title: {
		in: 'body',
	},
	content_abbreviation: {
		in: 'body',
	},
	consent_regist_title: {
		in: 'body',
	}
}

/**
 * キャラクターの登録
 */
exports.postRegistChara = {
	content_title_name: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
  conf_content_title: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	content_chara: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	consent_regist_chara: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
}