const requestObjectDefer = require('../../common/middleware/requestObjectDefer');
const responseObjectDefer = require('../../common/middleware/responseObjectDefer');
const globalVariables = require('../../common/middleware/globalVariables')
/**
 * テスト用のreq,res,nextを取得
 *
 */
exports.getControllerArguments = ()=>{
  const params = {
    req:{
      form_data: {
      },
      session:{
        save:(fnc)=>{fnc?fnc():null},
      },
    },
    res: {
      jsonResult: null, // res.jsonを呼ぶとjsonResultに結果が入る
      json: function(param){
        this.jsonResult = param;
        console.log('----- json -----', param, this);
        return this;
      },

      renderResult: null,  // res.renderを呼ぶとrenderResultに結果が入る
      render: function(text, obj){
        this.renderResult = {text, obj};
        return this;
      },

      statusResult: null,
      status: function(param){
        this.statusResult = param;
        return this;
      },
    },
    next: (err)=>{
      if(err) throw(err);
    },
  };
  requestObjectDefer(params.req, params.res, params.next);
  responseObjectDefer(params.req, params.res, params.next);
  globalVariables(params.req, params.res, params.next);
  return params;

}
