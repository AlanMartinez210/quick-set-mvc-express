const chai = require('chai'), should = chai.should(), assert = chai.assert;
const loginController = require('../../controllers/loginController');
const {req, res, next} = require('../expressModule/controllerHelper').getControllerArguments();
const errorHelper = require('../../common/helper/errorHelper');
const hashHelper = require('../../common/helper/hashHelper');
const registerService = require('../../services/registerService');
const seeder = require('../expressModule/seeder');

const {sequelize, User} = require('../../models');

describe('LoginController test', ()=>{
  let user1 = {user_key:"テストユーザーcos", user_type:1, password:hashHelper("tesuto_user?"), raw_password:"tesuto_user?"};
  before(async()=>{
    // テストユーザーの作成
    tmp_user1 = await seeder.createUser(user1);
    tmp_user1.raw_password = user1.raw_password;
    user1 = tmp_user1;
  });
  after(async()=>{
    seeder.allDestroy();
  });

  it('ログインできること', ()=>{
    req.form_data.user_key = user1.user_key;
    req.form_data.password = user1.raw_password;
    console.log('req.form_data',req.form_data)
    return loginController.postLoginIDPW(req, res, next)
    .then(()=>{
      assert.deepEqual(res.jsonResult, {success:'success'});
    });
  });

  it('IDが間違っている場合にエラーになること', ()=>{
    req.form_data.user_key = "dummy";
    req.form_data.password = user1.raw_password;
    return loginController.postLoginIDPW(req, res, next)
    .then(()=>{
      assert(false, 'ログインできました');
    })
    .catch((err)=>{
      assert.deepEqual(err, new errorHelper().setWindowMsg('E00001'));
    });
  });
});
