const {checkSchema, validationResult} = require('express-validator/check')
const errorHelper = require('../helper/errorHelper');
const formHelper = require("../helper/formHelper");

/**
 * ヴァリデーション処理を行います。
 *   - `check` 任意のformオブジェクトを受け取り、form内のvalidationを検証します。
 *   - `result` 検証結果を判定し、エラーまたは、req内にformオブジェクトを格納します。
 */
module.exports = {
  check: (form)=>{
    return checkSchema(form);
  },
  result:  (req, res, next) => {
    // formの初期化
    req.form_data = {};
    var results = validationResult(req);
    if(results.isEmpty()){
      // 特定のキーに対して変換処理を行う。
      req.form_data = formHelper.converter(Object.assign(req.body, req.query, req.params));
      next();
    }else{
      // バリデーションエラーの作成
      const vaild_err_arr = results.array();
      console.log('vaild_err_arr: ', vaild_err_arr);

      /** =====================================================================================
       * fatal -> このエラーが発生した場合を致命的エラーとし、500で落とす。
       * ※これらのエラーコードはID関係等の通常操作では欠落しないパラメーターに対して設定する。
       * location === params -> 不正URL扱いとし、404で落とす。
       ========================================================================================*/
      let eh = new errorHelper({ status: 400, code: "E00018" });
      for(const err of vaild_err_arr){
        if(err.msg === 'fatal'){
          eh = new errorHelper({ status: 500, logout: true });
          break;
        }

        if(err.location === 'params'){
          eh = new errorHelper({ status: 404 });
          break;
        }

        eh.addErrorData({
          view_id: err.param,
          code: err.msg
        })
      }
      next(eh);
    }
  }
}
