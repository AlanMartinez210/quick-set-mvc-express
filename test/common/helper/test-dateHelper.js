var chai = require('chai');
chai.use(require('chai-datetime'));
var should = chai.should();
var expect = chai.expect;
var dateHelper = require('../../../common/helper/dateHelper');

describe('dateHelper test', function() {

  describe('getDate test', function() {
    describe('例外判定', function() {
      it('引数がDate型以外の場合', function() {
        (function() {dateHelper.getDate("test")}).should.throw(Error, 'type of Date is expected.');
        (function() {dateHelper.getDate(123)}).should.throw(Error, 'type of Date is expected.');
        (function() {dateHelper.getDate(null)}).should.throw(Error, 'type of Date is expected.');
        (function() {dateHelper.getDate([])}).should.throw(Error, 'type of Date is expected.');
        (function() {dateHelper.getDate({})}).should.throw(Error, 'type of Date is expected.');
      });
    });

    describe('正常テスト', function() {

      it('引数に正常値を指定した場合', function(){
        const result = dateHelper.getDate(new Date("2018-2-23 12:21:25.000z")).toDate();
        const test_date = new Date("2018-2-23 12:21:25.000z");
        expect(result).to.equalDate(test_date);
      });

      it('引数を指定しない場合当日の日付が取得できる', function(){
        const result = dateHelper.getDate().toDate();
        const test_date = new Date();
        expect(result).to.equalDate(test_date);
      });
    });
  });

  describe('getWeek test', function() {
    describe('例外判定', function() {
      it('引数がint型0～6以外の場合', function() {
        (function() {dateHelper.getWeek("test")}).should.throw(Error, 'expect param is 0 to 6');
        (function() {dateHelper.getWeek(7)}).should.throw(Error, 'expect param is 0 to 6');
        (function() {dateHelper.getWeek(null)}).should.throw(Error, 'expect param is 0 to 6');
        (function() {dateHelper.getWeek([])}).should.throw(Error, 'expect param is 0 to 6');
        (function() {dateHelper.getWeek({})}).should.throw(Error, 'expect param is 0 to 6');
      });
    });

    describe('正常テスト', function() {
      it('0のとき日が取得できる', function(){ dateHelper.getWeek(0).should.equal("日"); });
      it('1のとき月が取得できる', function(){ dateHelper.getWeek(1).should.equal("月"); });
      it('2のとき火が取得できる', function(){ dateHelper.getWeek(2).should.equal("火"); });
      it('3のとき水が取得できる', function(){ dateHelper.getWeek(3).should.equal("水"); });
      it('4のとき木が取得できる', function(){ dateHelper.getWeek(4).should.equal("木"); });
      it('5のとき金が取得できる', function(){ dateHelper.getWeek(5).should.equal("金"); });
      it('6のとき土が取得できる', function(){ dateHelper.getWeek(6).should.equal("土"); });
    });
  });

  describe('createDate test', function() {
    describe('例外判定', function() {
      it('引数がint型以外且つ指定範囲外の場合', function() {
        (function() { dateHelper.createDate(-1, 2, 21) }).should.throw(Error, 'expect year param is 1970 to 9999');
        (function() { dateHelper.createDate(10000, 2, 21) }).should.throw(Error, 'expect year param is 1970 to 9999');
        (function() { dateHelper.createDate("test", 2, 21) }).should.throw(Error, 'expect year param is 1970 to 9999');

        (function() { dateHelper.createDate(2018, 0, 21) }).should.throw(Error, 'expect month param is 1 to 12');
        (function() { dateHelper.createDate(2018, 13, 21) }).should.throw(Error, 'expect month param is 1 to 12');
        (function() { dateHelper.createDate(2018, "test", 21) }).should.throw(Error, 'expect month param is 1 to 12');

        (function() { dateHelper.createDate(2018, 4, 0) }).should.throw(Error, 'expect day param is 1 to 31');
        (function() { dateHelper.createDate(2018, 4, 32) }).should.throw(Error, 'expect day param is 1 to 31');
        (function() { dateHelper.createDate(2018, 4, "test") }).should.throw(Error, 'expect day param is 1 to 31');
      });
    });

    describe('正常テスト', function() {
      it('引数で指定した日付が取得できる。', function(){ 
        const result = dateHelper.createDate(2018, 2, 20).toDate();
        const test_date = new Date("2018-2-20 00:00:00.000z");
        expect(result).to.equalDate(test_date);
      });
    });
  });

  describe('複合テスト', function() {
    let mDate;
    before(function(){
      // 2018/03/21(水)
      mDate = dateHelper.createDate(2018, 3, 21);
    });
    it('指定した年の文字列情報が取得できる。', function(){
      expect(mDate.year()).to.be.equal(2018);
    });
    it('指定した月の文字列情報が取得できる。', function(){
      expect(mDate.trueMonth()).to.be.equal(3);
    });
    it('指定した日の文字列情報が取得できる。', function(){
      expect(mDate.date()).to.be.equal(21);
    });
    it('指定した曜日の文字列情報が取得できる。', function(){
      const week = dateHelper.getWeek(mDate.day());
      expect(week).to.be.equal("水");
    });
  });
  
});