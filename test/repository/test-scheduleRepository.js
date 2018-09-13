var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var testMockData = require('../expressModule/testMockData');
var scheduleRepository = require('../../repository/scheduleRepository')();
var dateHelper = require('../../common/helper/dateHelper');

describe('scheduleRepository test', function() {
	const user_data = testMockData.getUser();
	const user_id = user_data.id;
	describe('getScheduleList test', function() {
		const test_date = dateHelper.createDate(2018, 8);
		describe('正常テスト', function() {
			it('指定した年月のスケジュールデータが取得できる。', () =>  {
				return 	scheduleRepository.getScheduleList(user_id, test_date)
				.then(res => {
					console.log(res);
				})
			});
		
		});
	});
	describe('getMonthScheduleNumList test', function() {

	});
	describe('getSchedule test', function() {

	});
	describe('upsertSchedule test', function() {

	});
	describe('deleteSchedule test', function() {

	});


	
	describe('getSchedule test', function() {
		it("正常テスト", function(){
			return scheduleRepository.getSchedule("1")
			.then(res => {
				console.log(res);
				const read = dateHelper.getDate(res.date_key);
				console.log(read);
				console.log(read.year());
				console.log(read.month());
				console.log(read.date());
				const read2 = dateHelper.getDate(res.created_at);
				console.log(read2);
				console.log(read2.year());
				console.log(read2.month());
				console.log(read2.date());
			})
		})
	})

})