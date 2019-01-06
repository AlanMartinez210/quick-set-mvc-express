/**
 * ユーザー情報取得
 */
module.exports = {
  schedule_id: { 
    in: 'params',
    isEmpty: { errorMessage: 'fatal', negated: true },
  },
}