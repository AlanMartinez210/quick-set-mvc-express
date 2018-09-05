const errorHelper = require('../helper/errorHelper');
const sessionHelper = require('../helper/sessionHelper');
/**
 * ログインしているかどうか確認し、ログインしていない場合はログインエラーを生成 新規登録ページにリダイレクトする
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports =  function(req, res, next) {
  var userData = sessionHelper.getUserData(req);
  if(!userData){
    const error_obj = new errorHelper({http_status: 401, redirect_to: "/register"});
    error_obj.addErrorData({code: "L00001"});
    next(error_obj);
  }else{
    next();
  }
};
