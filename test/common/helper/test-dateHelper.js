var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var dateHelper = require('../../../common/helper/dateHelper');

describe('dateHelper test', function() {

  describe('getDate test', function() {
    describe('例外判定: ', function() {
      it('引数がDate型以外の場合', function() {
        // (dateHelper.getDatetime).should.throw(Error);
        (function() {dateHelper.getDate("test")}).should.throw(Error, 'type of Date is expected.');
        (function() {dateHelper.getDate(123)}).should.throw(Error, 'type of Date is expected.');
        (function() {dateHelper.getDate(null)}).should.throw(Error, 'type of Date is expected.');
        (function() {dateHelper.getDate([])}).should.throw(Error, 'type of Date is expected.');
        (function() {dateHelper.getDate({})}).should.throw(Error, 'type of Date is expected.');
      });
    });

    describe('正常テスト', function() {

      it('引数に正常値を指定した場合', function(){
        const date = dateHelper.getDate(new Date("2018-2-23 12:21:25.000+09:00")).toDate();
        const test_date = new Date("2018-2-23 12:21:25.000+09:00");
        expect(date).to.deep.equal(test_date);
      });

      it('引数を指定しない場合現在時刻が取得される。', function(){
        const date = dateHelper.getDate().toDate();
        console.log(date);
        expect(date).to.equal.true;
      });

    });
  });

});