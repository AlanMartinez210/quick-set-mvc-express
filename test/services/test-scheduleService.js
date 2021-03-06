global.APPENV = {
  PAGE_COUNT: 10
}

var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
const dateHelper = require('../../common/helper/dateHelper');
var scheduleService = require("../../services/scheduleService");

const expect_data = [
  { 
    id: 24, 
    user_id: 1, 
    schedule_type: 2, 
    group_year: 2018, 
    group_month: 8, 
    date_key: dateHelper.createDate(2018, 8, 1).toDate(), 
    time_from: '11:00', 
    time_to: '17:00',
    shot_type: 1, 
    event_name: 'テストイベント', 
    event_url: 'htt://c2link.com/detail/event/test', 
    cost: 1000, 
    num: 1, 
    cos_chara: null, 
    remarks: 'カメラマンテストスケジュール'
  },
  { 
    id: 2, 
    user_id: 1, 
    schedule_type: 2, 
    group_year: 2018, 
    group_month: 8, 
    date_key: dateHelper.createDate(2018, 8, 16).toDate(), 
    time_from: "11:00", 
    time_to: "17:00", 
    shot_type: 1, 
    event_name: "テストイベント", 
    event_url: "htt://c2link.com/detail/event/test", 
    cost: 1000, 
    num: 1, 
    cos_chara: null, 
    remarks: "カメラマンテストスケジュール"
  }
]

describe('schedule service test', function() {
  // describe('::getMonthSchedule()', function() {
  //   describe('○正常テスト', function () {
  //     it('指定した年月(2018/08)のスケジュールリストを取得する。', () =>  {
  //       const stub = sinon.stub(scheduleRepository, "getScheduleList");
  //       stub.withArgs(1, 2018, 8).returns(expect_data);
  //       return scheduleService.getMonthSchedule(1, 2018, 8)
  //       .then(res => {
  //         // データ数
  //         expect(res.length).to.be.equal(31);
  //         // カレンダーが保持するスケジュール
  //         res.forEach(ele => {
  //           // 指定年月との一致
  //           expect(ele.year).to.be.equal(2018);
  //           expect(ele.month).to.be.equal(8);
  //           // 1日と16日にスケジュールが存在する。
  //           if(ele.day === 1){
  //             expect(ele.schedule[0]).to.deep.equal(expect_data[0])
  //           }
  //           else if(ele.day === 16){
  //             expect(ele.schedule[0]).to.deep.equal(expect_data[1])
  //           }
  //         });
  //       })
  //     });
  //   });
  // });

  // describe('::getMonthScheduleNumList()', function() {
  //   describe('○正常テスト', function () {
  //     it('指定した年ごとに登録されているスケジュール数を保持した配列を取得する。(2018/08 & 09 & 10)'
  //     // , () => {
  //     //   const expect_data = [0,0,0,0,0,0,0,10,10,10,0,0];
  //     //   const test_user_id = 1;
  //     //   const stub = sinon.stub(scheduleRepository, "getMonthScheduleNumList");
  //     //   const stub_return_obj = [
  //     //     { month: 8, count: 10 },
  //     //     { month: 9, count: 10 },
  //     //     { month: 10, count: 10 }
  //     //   ]
  //     //   stub.withArgs(1, 2018).returns(stub_return_obj);
  //     //   return scheduleService.getMonthScheduleNumList(test_user_id, 2018)
  //     //   .then(res => {
  //     //     expect(expect_data).to.deep.equals(res);
  //     //   })
  //     // }
  //     )
  //   });
  // });

  describe('::getScheduleData()', function() {
    describe('○正常テスト', function () {
      it('指定したスケジュールIDのスケジュールを取得する。', () => {
        const test_schedule_id = 24;

        return scheduleService.getScheduleData(test_schedule_id)
        .then(res => {
        })
      }
      );
    });
  });

  // describe('::upsertScheduleData()', function() {
  //   describe('○正常テスト', function () {
  //     it('指定したスケジュールデータを登録処理に渡し、正常結果を取得する。', () => {
        
  //     })
  //   });
  // });

  // describe('::deleteScheduleData()', function() {
  //   describe('○正常テスト', function () {
  //     it('指定したスケジュールIDを削除処理に渡し、正常結果を取得する。')
  //   });
  // });
});