/** プロフィール編集するフォーム */
module.exports = {
	// ユーザーID
	user_id: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
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