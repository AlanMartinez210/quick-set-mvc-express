var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var testMockData = require('../expressModule/testMockData');
var scheduleRepository = require('../../repository/scheduleRepository')();
var dateHelper = require('../../common/helper/dateHelper');
var basePattern = require("../expressModule/testData/basePattern");

describe('scheduleRepository test', function() {
    const user_data = testMockData.getUser();
    const user_id = user_data.id;
    describe('getScheduleList test', function() {
        const test_date = dateHelper.createDate(2018, 9);
        describe('正常テスト', function() {
            it('指定した年月のスケジュールデータが取得できる。', () =>  {
                const bp = new basePattern();

                // return scheduleRepository.getScheduleList(user_id, test_date.year(), test_date.trueMonth())
                // .then(res => {
                //     console.log(res);
                // })
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

})
