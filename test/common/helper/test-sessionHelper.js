var chai = require('chai');
var expect = chai.expect;
var sessionHelper = require('../../../common/helper/sessionHelper');
var basePattern = require("../../../testdata/pattern/basePattern");

describe('sessionHelper test', function() {
  let user_data = {};
  let req_data = {};
  const bp = new basePattern();
  before(async () => {
    const bp = new basePattern();
    await bp.genTestData();
    user_data = await bp.getUserData(1);
    req_data = await bp.getloginSesstionRequest(1)
  });

  describe('setUserData/getUserData test', function() {
    describe('例外判定:setUserData', function() {
      it('不正な値の場合はエラーを出す。', function(){
        (function() { sessionHelper.setUserData(null, user_data) }).should.throw(Error, 'request object does not exist');
        (function() { sessionHelper.setUserData(undefined, user_data) }).should.throw(Error, 'request object does not exist');

        (function() { sessionHelper.setUserData(req_data, null) }).should.throw(Error, 'user object does not exist');
        (function() { sessionHelper.setUserData(req_data, undefined) }).should.throw(Error, 'user object does not exist');
      });
    });
    describe('例外判定:getUserData', function() {
      it('不正な値の場合はエラーを出す。', function(){
        (function() { sessionHelper.getUserData(null) }).should.throw(Error, 'request object does not exist');
        (function() { sessionHelper.getUserData(undefined) }).should.throw(Error, 'request object does not exist');
      });
    });
    describe('正常テスト', function(){
      it('ユーザーデータをセッションに設定し、取得できる'
      // , function(){
      //   return bp.getUserData(4)
      //   .then(res => {
      //     sessionHelper.setUserData(req_data, user_data);
      //     const result = sessionHelper.getUserData(req_data);
      //     expect(result).to.deep.equal(test_data);
      //   });
      // }
      );
    });
  });
  describe('getUserId test', function() {
    describe('例外判定', function() {
      it('不正な値の場合はエラーを出す。', function(){
        (function() { sessionHelper.getUserId(null) }).should.throw(Error, 'request object does not exist');
        (function() { sessionHelper.getUserId(undefined) }).should.throw(Error, 'request object does not exist');
      });
    });
    describe('正常テスト', function(){
      it('ユーザーデータをセッションに設定し、user_idを取得できる'
      // , function(){
      //   const test_data = 999999;
      //   sessionHelper.setUserData(req_data, user_data);
      //   const result = sessionHelper.getUserId(req_data);
      //   expect(result).to.deep.equal(test_data);
      // }
      );
    });
  });
  describe('getUserType test', function() {
    describe('例外判定', function() {
      it('不正な値の場合はエラーを出す。', function(){
        (function() { sessionHelper.getUserType(null) }).should.throw(Error, 'request object does not exist');
        (function() { sessionHelper.getUserType(undefined) }).should.throw(Error, 'request object does not exist');
      });
    });
    describe('正常テスト', function(){
      it('ユーザーデータをセッションに設定し、user_typeを取得できる', function(){
        const test_data = 2;
        sessionHelper.setUserData(req_data, user_data);
        const result = sessionHelper.getUserType(req_data);
        expect(result).to.deep.equal(test_data);
      });
    });
  });

});