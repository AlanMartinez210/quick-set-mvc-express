const chai = require('chai'), should = chai.should(), assert = chai.assert;
const loginService = require('../../services/loginService');
const {req, res, next} = require('../expressModule/controllerHelper').getControllerArguments();
const errorHelper = require('../../common/helper/errorHelper');
const hashHelper = require('../../common/helper/hashHelper');
const registerService = require('../../services/registerService');

const {sequelize, User} = require('../../models');


describe('LoginService test', ()=>{
  const user1 = {user_key:"テストユーザーcos", user_type:1, password:"tesuto_user?", raw_password: "tesuto_user?"};
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

  it('ログインできること', async ()=>{
    return await loginService.loginByIDPW(user1.user_key, hashHelper(user1.raw_password))
    .then((res)=>{
      assert.deepEqual(res.id, user1.id);
    });
  });

  it('失敗した場合にE00001エラーが返ってくること', async ()=>{
    return await loginService.loginByIDPW(user1.user_key, user1.raw_password /* ハッシュ化しない */)
    .then(res=>{
      assert(false, "ログインできました");
    })
    .catch((err)=>{
      const msg = new errorHelper().setWindowMsg('E00001');
      msg.window_msg = "ログイン情報が間違っています";
      assert.deepEqual(err, msg);
    });
  });
});
