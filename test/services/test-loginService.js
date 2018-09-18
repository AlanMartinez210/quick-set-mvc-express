const chai = require('chai'), should = chai.should(), assert = chai.assert;
const loginService = require('../../services/loginService');
const {req, res, next} = require('../expressModule/controllerHelper').getControllerArguments();
const errorHelper = require('../../common/helper/errorHelper');
const hashHelper = require('../../common/helper/hashHelper');
const registerService = require('../../services/registerService');
const seeder = require('../expressModule/seeder');

const {sequelize, User} = require('../../models');


describe('LoginService test', ()=>{
  let user1 = {user_key:"テストユーザーcos", user_type:1, password:hashHelper("tesuto_user?"), raw_password: "tesuto_user?"};
  before(async()=>{
    // テストユーザーの作成
    user1 = await seeder.createUser(user1);
    console.log(user1);
  });
  after(async()=>{
    seeder.allDestroy();
  });

  it('ログインできること', async ()=>{
    return await loginService.loginByIDPW(user1.user_key, user1.password)
    .then((res)=>{
      assert.deepEqual(res.id, user1.id);
    });
  });

  it('失敗した場合にE00001エラーが返ってくること', async ()=>{
    return await loginService.loginByIDPW(user1.user_key, user1.password+"aa")
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
