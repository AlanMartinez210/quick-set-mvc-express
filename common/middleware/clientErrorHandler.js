const sessionHelper = require('../helper/sessionHelper');

/**
 * XMLHttpRequest時のエラーをハンドリングするミドルウェアを提供します。
 */

module.exports = function(err, req, res, next){
  if(req.xhr){
    // 強制的にログアウト?
    if(err.logout) sessionHelper.deleteSession(req);
    res.status(err.status).json(err);
  }
  else{
    next(err);
  }
}