/**
 * ユーザー情報取得
 */
exports.getUser = {
  user_id: { 
    in: 'params',
    isEmpty: { errorMessage: 'fatal', negated: true },
  },
}

/**
 * ユーザー新規登録
 */
exports.post = {
	user_name: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	password: {
		in: 'body',
		isLength: {
      errorMessage: 'E00004',
      options: { min: 7 }
		},
		matches: {
			errorMessage: 'E00004',
			options: '^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$',
			negated: true,
		},
	},
	email: {
		in: 'body',
		isEmail: {
			errorMessage: 'E00003',
		},
	},
	user_type: {
		in: 'body',
		isIn: {
			errorMessage: 'E00006',
			options: [['1','2']],
		},
		isEmpty: { errorMessage: `E00005`, negated: true }
	}
}

/**
 * ログイン
 */
exports.postLogin = {
	login_key: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	login_password: {
		in: 'body',
		isLength: {
      errorMessage: 'E00004',
      options: { min: 7 }
		},
		matches: {
			errorMessage: 'E00004',
			options: '^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$',
			negated: true,
		}
	},
}

/**
 * プロフィールの編集
 */
exports.putProfile = {
	// ユーザーID
	user_id: {
		in: 'body',
		isEmpty: { errorMessage: 'fatal', negated: true },
	},
	// ユーザーアイコン
	icon_url: {
		in: 'body',
	},
	// ユーザー名
	user_name: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
		isLength: { errorMessage: 'E00007', options:{max: 50} }
	},
	// メールアドレス
	email: {
		in: 'body',
		isEmail: { errorMessage: 'E00003' },
		isLength: { errorMessage: 'E00007', options:{max: 255} }
	},
	// 地域
	prefectures_field: {
		in: 'body',
		isArray:{ errorMessage: 'E00006' },
	},
	// タグ一覧
	tag_field: {
		in: 'body',
		isArray:{ errorMessage: 'E00006' }
	},
};

/** 
 * ユーザー削除フォーム 
 * ※照合目的なので、バリデーションを行わない。
 * */
exports.delete = {
	password: {
		in: 'body'
	}
}