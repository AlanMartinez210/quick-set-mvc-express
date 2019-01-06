/**
 * ユーザー情報取得
 */
module.exports = {
  user_id: { 
    in: 'params',
    isEmpty: { errorMessage: 'fatal', negated: true },
  },
}