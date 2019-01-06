/** サイト設定の送信フォーム */
module.exports = {
  allowBookmarkFlg: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	}
}
