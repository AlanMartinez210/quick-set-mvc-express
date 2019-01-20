/** サイト設定の送信フォーム */
exports.post = {
  allowBookmarkFlg: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	}
}
