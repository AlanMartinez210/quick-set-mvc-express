
const title_obj = {
	name: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	sub_title: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	abbreviation: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	}
}

const chara_obj = {
	content_title_id: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	name_type:{
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	name: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	}
}

/**
 * 作品/キャラクターの取得 
 */
exports.info = {
	type: {
		in: 'params',
		isIn: {
			errorMessage: "E00017",
			options: [['title', 'chara']]
		},
		isEmpty: { errorMessage: 'fatal', negated: true }
	},
	id: {
		in: 'query',
		isEmpty: { errorMessage: 'E00020', negated: true }
	}
}

/**
 * 作品/キャラクターの検索
 */
exports.search = {
	type: {
		in: 'params',
		isIn: {
			errorMessage: "E00017",
			options: [['title', 'chara']]
		},
		isEmpty: { errorMessage: 'fatal', negated: true }
	},
	keyword: {
		in: 'query',
		isEmpty: { errorMessage: 'E00002', negated: true }
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
/**
 * 作品情報の更新
 */
exports.updateTitle = title_obj;

/**
 * キャラクター情報の登録
 */
exports.updateChara = chara_obj;


/**
 * 作品情報の削除
 */
exports.deleteTitle = {
	id: 'body',
	isEmpty: { errorMessage: 'fatal', negated: true }
}

/**
 * キャラクター情報の削除
 */
exports.deleteChara = {
	id: 'body',
	isEmpty: { errorMessage: 'fatal', negated: true }
}