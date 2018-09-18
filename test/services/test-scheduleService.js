var chai = require('chai');
var should = chai.should();
var sinon = require("sinon");
var scheduleRepository = require("../../repository/scheduleRepository");
var scheduleService = require("../../services/scheduleService");

describe('schedule service test', function() {

  describe('getMonthSchedule', function() {
    it('実行後よくできましたを返さなくてはいけません。', () =>  {
      const testRepo = scheduleRepository();
      const stub = sinon.stub(testRepo, "getScheduleList");
      stub.withArgs(["999999", "2018", "8"]).returns("true");
      // stub.returns(Promise.resolve("hoge"));
      return scheduleService.getMonthSchedule("999999", "2018", "8")
      .then(res => {
        console.log(res);
        // res.should.equal("dekimasita");
      })
    });
  });
  // describe('getMonthScheduleNumList', function() {
  //   it('実行後よくできましたを返さなくてはいけません。', () =>  {
  //     return scheduleService.getMonthSchedule("999999", "2018", "8")
  //     .then(res => {
  //       res.should.equal("dekimasita");
  //     })
  //   });
  // });
  // describe('getScheduleData', function() {
  //   it('実行後よくできましたを返さなくてはいけません。', () =>  {
  //     return scheduleService.getMonthSchedule("999999", "2018", "8")
  //     .then(res => {
  //       res.should.equal("dekimasitayo");
  //     })
  //   });
  // });
  // describe('upsertScheduleData', function() {
  //   it('実行後よくできましたを返さなくてはいけません。', () =>  {
  //     return scheduleService.getMonthSchedule("999999", "2018", "8")
  //     .then(res => {
  //       res.should.equal("dekimasita");
  //     })
  //   });
  // });
  // describe('deleteScheduleData', function() {
  //   it('実行後よくできましたを返さなくてはいけません。', () =>  {
  //     return scheduleService.getMonthSchedule("999999", "2018", "8")
  //     .then(res => {
  //       res.should.equal("dekimasita");
  //     })
  //   });
  // });

});