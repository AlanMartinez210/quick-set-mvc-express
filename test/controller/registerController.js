const chai = require('chai'), should = chai.should(), assert = chai.assert;
const {getControllerArguments} = require('../expressModule/controllerHelper');
const registerController = require('../../controllers/registerController');
const errorHelper = require('../../common/helper/errorHelper');

const {sequelize, User} = require('../../models');

describe('RegisterController test', ()=>{
  const user1 = {
    user_name:"テストユーザーcos",
    user_type:1,
    password:"tesuto_user?",
    email: "RegisterControllerTest1@RegisterControllerTest.com",
  };
  const user2 = {
    user_name:"テストユーザーcam",
    user_type:2,
    password:"tesuto_user?",
    email: "RegisterControllerTest2@RegisterControllerTest.com",
  };
  before(async()=>{
  });
  after(async()=>{
    User.destroy({where:{email: user1.email}});
    User.destroy({where:{email: user2.email}});
  });

  it('index : ページが正しく表示できること', async()=>{
    const {req, res, next} = getControllerArguments();
    const expect = Object.assign(JSON.parse(JSON.stringify(res.render_obj)) ,{
      contentId: "register",
    	title: "新規登録",
      session:res.render_obj.session,
    });
    await registerController.index(req, res, next)
    assert.deepEqual(res.renderResult, {text: 'register', obj:expect});
  });

  it('postCreateUser : ユーザーを作成できること(cos)', async()=>{
    const {req, res, next} = getControllerArguments();
    req.form_data = user1;
    await registerController.postCreateUser(req, res, next);
    assert.deepEqual(res.jsonResult, {success:"success"});
  });

  it('postCreateUser : ユーザーを作成できること(cam)', async()=>{
    const {req, res, next} = getControllerArguments();
    req.form_data = user2;
    await registerController.postCreateUser(req, res, next);
    assert.deepEqual(res.jsonResult, {success:"success"});
  });

  it('postCreateUser : エラー時にnextが呼ばれること', async()=>{
    const {req, res, next} = getControllerArguments();
    return registerController.postCreateUser({form_data:{}}, null, next)
    .then(()=>{
      assert(false, 'エラーにならなかったよ');
    })
    .catch(err=>{
      assert(next);
    });
  });


});
