const sessionHelper = require('../helper/sessionHelper');

/**
 * エラーをハンドリングするミドルウェアを提供します。
 */

module.exports = function(err, req, res, next){
  const render_obj = res.render_obj;
  render_obj.contentId = "error";
  switch(err.status){
    case 404:
      render_obj.title = "お探しのページは見つかりませんでした。|エラーページ";
      break;
    case 403:
    case 401:
      render_obj.title = "ログイン期限が切れました。|エラーページ";
      break;
    default:
      render_obj.title = "申し訳ありません。|エラーページ";
  }

  // 強制的にログアウト?
  if(err.logout) sessionHelper.deleteSession(req);

  render_obj.bodyData.error = {
    message: err.message,
    status: err.status,
    stack: err.stack
  }

  res.status(err.status).render('error', render_obj);
}