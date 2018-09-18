var chai = require('chai');
var expect = chai.expect;
var testMockData = require('../expressModule/testMockData');
var userRepository = require('../../repository/userRepository')

describe('userRepository test', function() {
  const test_user_data = testMockData.getUserFormData();
  //最初にuserテーブルを空にする
  before(async() =>{
    userRepository().Sequelize.query(`truncate table users;`,{});
  });

  describe('register test', function() {
    describe('正常処理', function() {
      it('ユーザーの登録を行う。', () =>  {
        return userRepository().register(test_user_data)
        .then(res => {
          expect(res).to.include(test_user_data);
        })
      });
    });
  });

  describe('findUserByEmail test', function() {
    describe('正常処理', function() {
      describe('検索キーからユーザー情報を取得する。', () =>  {
        it('ユーザーID', () => {
          console.log(test_user_key);
          return userService.login()
        });
        it('ユーザー名', () => {
          console.log(test_user_key);
          return userService.login()
        });
        it('メールアドレス', () => {
          console.log(test_user_key);
          return userService.login()
        });
        // return userRepository().findUserByEmail(test_user_data.email)
        // .then(res => {
        //   expect(res).to.include(test_user_data);
        // })
      });
    });
  });
})
