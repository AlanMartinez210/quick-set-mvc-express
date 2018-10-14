var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var calendarHelper = require('../../../common/helper/calendarHelper');

describe('calendarHelper test', function() {

	const testCln = [
		{ year: 2018, month: 9, day: 1, week: '土', holiday: '' },
		{ year: 2018, month: 9, day: 2, week: '日', holiday: '' },
		{ year: 2018, month: 9, day: 3, week: '月', holiday: '' },
		{ year: 2018, month: 9, day: 4, week: '火', holiday: '' },
		{ year: 2018, month: 9, day: 5, week: '水', holiday: '' },
		{ year: 2018, month: 9, day: 6, week: '木', holiday: '' },
		{ year: 2018, month: 9, day: 7, week: '金', holiday: '' },
		{ year: 2018, month: 9, day: 8, week: '土', holiday: '' },
		{ year: 2018, month: 9, day: 9, week: '日', holiday: '' },
		{ year: 2018, month: 9, day: 10, week: '月', holiday: '' },
		{ year: 2018, month: 9, day: 11, week: '火', holiday: '' },
		{ year: 2018, month: 9, day: 12, week: '水', holiday: '' },
		{ year: 2018, month: 9, day: 13, week: '木', holiday: '' },
		{ year: 2018, month: 9, day: 14, week: '金', holiday: '' },
		{ year: 2018, month: 9, day: 15, week: '土', holiday: '' },
		{ year: 2018, month: 9, day: 16, week: '日', holiday: '' },
		{ year: 2018, month: 9, day: 17, week: '月', holiday: '敬老の日' },
		{ year: 2018, month: 9, day: 18, week: '火', holiday: '' },
		{ year: 2018, month: 9, day: 19, week: '水', holiday: '' },
		{ year: 2018, month: 9, day: 20, week: '木', holiday: '' },
		{ year: 2018, month: 9, day: 21, week: '金', holiday: '' },
		{ year: 2018, month: 9, day: 22, week: '土', holiday: '' },
		{ year: 2018, month: 9, day: 23, week: '日', holiday: '秋分の日' },
		{ year: 2018, month: 9, day: 24, week: '月', holiday: '振替休日' },
		{ year: 2018, month: 9, day: 25, week: '火', holiday: '' },
		{ year: 2018, month: 9, day: 26, week: '水', holiday: '' },
		{ year: 2018, month: 9, day: 27, week: '木', holiday: '' },
		{ year: 2018, month: 9, day: 28, week: '金', holiday: '' },
		{ year: 2018, month: 9, day: 29, week: '土', holiday: '' },
		{ year: 2018, month: 9, day: 30, week: '日', holiday: '' }
	];

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

			// it(`指定月のカレンダーが取得できる: テスト月 -> 2018/9`, function(){
			// 	const result = calendarHelper.getCalendar(2018, 9);
			// 	result.forEach((res, i) => {
			// 		expect(res).to.deep.equal(testCln[i]);
			// 	});
			// });

			it(`指定月のカレンダーが取得できる: テスト月 -> 2018/9`)

		});
	});
});