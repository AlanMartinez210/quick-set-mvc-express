const chai = require('chai'), should = chai.should(), assert = chai.assert;
const testController = require('../../controllers/loginController');
const {req, res, next} = require('../expressModule/controllerHelper').getControllerArguments();
const errorHelper = require('../../common/helper/errorHelper');
const registerService = require('../../services/registerService');

const {sequelize, User} = require('../../models');

describe('dateHelper test', ()=>{
  let user_key = "テストユーザー";
  const password = "tesuto_user?";
  before(async()=>{
    // テストユーザーの作成
    req.form_data.user_key = user_key;
    req.form_data.password = password;
    req.form_data.user_type = 1;
    let user = await registerService.registerUser(req);
    user = await User.findOne({where:{id:user.id}});
    user_key = user.user_key;
  });

  it('ログインできること', ()=>{
    req.form_data.user_key = user_key;
    req.form_data.password = password;
    return testController.postLoginIDPW(req, res, next)
    .then(()=>{
      assert.deepEqual(res.jsonResult, {success:'success'});
    });
  });

  it('ログインできない場合にエラーになること', ()=>{
    req.form_data.user_key = "dummy";
    req.form_data.password = password;
    return testController.postLoginIDPW(req, res, next)
    .then(()=>{
      assert(false, 'ログインできました');
    })
    .catch((err)=>{
      assert.deepEqual(err, new errorHelper().setWindowMsg('E00001'));
    });
  });


});
