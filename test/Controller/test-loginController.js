const chai = require('chai'), should = chai.should(), assert = chai.assert;
const loginController = require('../../controllers/loginController');
const {req, res, next} = require('../expressModule/controllerHelper').getControllerArguments();
const errorHelper = require('../../common/helper/errorHelper');
const registerService = require('../../services/registerService');

const {sequelize, User} = require('../../models');

describe('LoginController test', ()=>{
  const user1 = {user_key:"テストユーザーcos", user_type:1, password:"tesuto_user?", raw_password:"tesuto_user?"};
  before(async()=>{
    // テストユーザーの作成
    let user = await registerService.registerUser(user1);
    user = await User.findOne({where:{id:user.id}});
    user1.user_key = user.user_key;
    user1.id = user.id;
  });
  after(async()=>{
    User.destroy({where:{id: user1.id}});
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
