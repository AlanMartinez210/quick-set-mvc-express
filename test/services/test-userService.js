const chai = require('chai'), 
should = chai.should();
var expect = chai.expect;
const testMockData = require('../expressModule/testMockData');
const userService = require('../../services/userService');
const userRepository = require('../../repository/userRepository');
const errorHelper = require('../../common/helper/errorHelper');
const hashHelper = require('../../common/helper/hashHelper');


describe('userService test', ()=>{
  // テストデータ
  const test_user_data = testMockData.getUserFormData();
  //最初にuserテーブルを空にする
  before(async()=>{
    userRepository().Sequelize.query(`truncate table users;`,{});
  });

  describe('registerUser test', () => {
    describe('正常処理', () => {
      it('ユーザーの登録を行い、登録オブジェクトの存在を確認する。', () =>  {
        return userService.registerUser(test_user_data)
        .then(res => {
          test_user_data.password = hashHelper("pass");
          expect(res).to.include(test_user_data);
        })
      });
    });
  });

  describe('login test', () => {
    describe('正常処理', () => {
      describe('ログインキーからユーザーを検索、取得し、セッションに保存する。', () => {
        it('ユーザーID', () => {
          return userService.login()
          .then(res => {
            console.log(res);
          });
        });
        it('ユーザー名', () => {
          return userService.login(test_user_data.user_name)
          .then(res => {
            console.log(res);
          });
        });
        it('メールアドレス', () => {
          return userService.login(test_user_data.email)
          .then(res => {
            console.log(res);
          });
        });
        
        
      });
    });
  });

  //   return userService.loginByIDPW(user1.user_key, hashHelper(user1.raw_password))
  //   .then((res)=>{
  //     assert.deepEqual(res.id, user1.id);
  //   });
  // });

  // it('失敗した場合にE00001エラーが返ってくること', async ()=>{
  //   return await loginService.loginByIDPW(user1.user_key, user1.raw_password /* ハッシュ化しない */)
  //   .then(res=>{
  //     assert(false, "ログインできました");
  //   })
  //   .catch((err)=>{
  //     const msg = new errorHelper().setWindowMsg('E00001');
  //     msg.window_msg = "ログイン情報が間違っています";
  //     assert.deepEqual(err, msg);
  //   });
  // });
});
