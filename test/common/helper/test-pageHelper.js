var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var pageHelper = require('../../../common/helper/pageHelper');

describe('pageHelper test', function() {
  // describe('エラーテスト', function() {
  //   it('不正な値の場合はエラーを出す。', function(){
  //     (function() { pageHelper.makePageObject(null, null) }).should.throw(Error, 'type of Number or integer is expected.');
  //     (function() { pageHelper.makePageObject(undefined, undefined) }).should.throw(Error, 'type of Number or integer is expected.');
  //     (function() { pageHelper.makePageObject("test", "test") }).should.throw(Error, 'type of Number or integer is expected.');
  //   });
  // });

  describe('正常テスト', function() {
    it('指定した引数から期待したオブジェクトが取得出来る。', function(){
      const test_data1 = {count: 15, now_page: 1, max_page: 2}
      const test_data2 = {count: 36, now_page: 2, max_page: 4}
      const test_data3 = {count: 75, now_page: 6, max_page: 8}
      expect(pageHelper.makePageObject(15, 1)).to.deep.equal(test_data1);
      expect(pageHelper.makePageObject(36, 2)).to.deep.equal(test_data2);
      expect(pageHelper.makePageObject(75, 6)).to.deep.equal(test_data3);
    });
  });
});