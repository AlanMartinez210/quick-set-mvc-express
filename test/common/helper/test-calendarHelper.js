var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var calendarHelper = require('../../../common/helper/calendarHelper');
var test_mock_data = require('../../expressModule/testMockData');

describe('calendarHelper test', function() {

	const testCln = test_mock_data.getCalendarDateList();

	describe('getCalendar test', function() {
		describe('例外判定', function() {
			it('引数がint型以外且つ指定範囲外の場合', function() {
				(function() { calendarHelper.getCalendar(1969, 9) }).should.throw(Error, 'expect year param is 1970 to 9999');
        (function() { calendarHelper.getCalendar(10000, 9) }).should.throw(Error, 'expect year param is 1970 to 9999');
        (function() { calendarHelper.getCalendar("test", 9) }).should.throw(Error, 'expect year param is 1970 to 9999');

        (function() { calendarHelper.getCalendar(2018, 0) }).should.throw(Error, 'expect month param is 1 to 12');
        (function() { calendarHelper.getCalendar(2018, 13) }).should.throw(Error, 'expect month param is 1 to 12');
        (function() { calendarHelper.getCalendar(2018, "test") }).should.throw(Error, 'expect month param is 1 to 12');
			});
		});
		describe('正常テスト', function(){
			it(`指定月のカレンダーが取得できる: テスト月 -> 2018/9`, function(){
				const result = calendarHelper.getCalendar(2018, 9);
				result.forEach((res, i) => {
					expect(res).to.deep.equal(testCln[i]);
				});
			});

		});
	});
});