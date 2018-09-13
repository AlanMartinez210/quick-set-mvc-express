var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var hashHelper = require('../../../common/helper/hashHelper');

describe('hashHelper test', function() {
  describe('エラーテスト', function() {
    it('不正な値の場合はエラーを出す。', function(){
			(function() { hashHelper() }).should.throw(Error, 'invalid parameter');
			(function() { hashHelper(null) }).should.throw(Error, 'invalid parameter');
			(function() { hashHelper(undefined) }).should.throw(Error, 'invalid parameter');
			(function() { hashHelper(false) }).should.throw(Error, 'invalid parameter');
    });
  });

  describe('正常テスト', function() {
    it('指定した文字列から期待したハッシュが作成できる。', function(){
			expect(hashHelper("test")).to.be.equal("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");
    });
  });
});