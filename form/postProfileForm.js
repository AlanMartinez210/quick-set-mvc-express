/** プロフィール編集するフォーム */
module.exports = {
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
	prefectures: {
		in: 'body',
		isArray:{
			errorMessage: 'prefectures must be array',
		}
	},
	// タグ
	tags: {
		in: 'body',
		isArray:{
			errorMessage: 'tags must be array',
		}
	},
};