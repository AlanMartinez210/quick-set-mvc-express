/**
 * ユーザー情報取得
 */
module.exports = {
  user_id: { in: 'params',
    exists: {
      errorMessage: 'L00003',
    },
  },
}