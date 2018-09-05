const {checkSchema, validationResult} = require('express-validator/check')
const errorHelper = require('../helper/errorHelper');

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
    var results = validationResult(req);
    if(results.isEmpty()){
      req.form_data = req.body;
      next();
    }else{
      // バリデーションエラーの作成
      const vaild_err_arr = results.array();
      console.log("---- valid error ----", vaild_err_arr);
      const eh = new errorHelper({http_status: 400});
      vaild_err_arr.forEach(ele => {
        eh.addErrorData({
          view_id: ele.param,
          code: ele.msg
        })
      })
      next(eh);
    }
  }
}
