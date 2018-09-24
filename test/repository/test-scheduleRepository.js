var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var scheduleRepository = require('../../repository/scheduleRepository')();
var dateHelper = require('../../common/helper/dateHelper');
var basePattern = require("../expressModule/testData/basePattern");

describe('scheduleRepository test', function () {
  let user_data_cam = {};
  let user_data_cos = {};
  let bp = {};
  const test_date = dateHelper.createDate(2018, 9);
  before(async () => {
    bp = new basePattern();
    await bp.genTestData();
    user_data_cam = await bp.getUserData(1);
    user_data_cos = await bp.getUserData(4);
  });

  describe('::getScheduleList()', function () {
    describe('○正常テスト', function () {
      it('user_id -> 1(カメラマン)のとき指定した年月のスケジュールデータが取得できる。', () => {
        const expect_data_num = 10;
        return scheduleRepository.getScheduleList(user_data_cam.id, test_date.year(), test_date.trueMonth())
          .then(res => {
            expect(res.length).to.be.equal(expect_data_num);
            res.forEach(ele => {
              expect(ele.user_id).to.be.equal(1);
              expect(ele.schedule_type).to.be.equal(2);
              expect(ele.group_year).to.be.equal(2018);
              expect(ele.group_month).to.be.equal(9);
            });
          })
      });
      it('user_id -> 4(コスプレ)のとき指定した年月のスケジュールデータが取得できる。', () => {
        const expect_data_num = 10;
        return scheduleRepository.getScheduleList(user_data_cos.id, test_date.year(), test_date.trueMonth())
          .then(res => {
            expect(res.length).to.be.equal(expect_data_num);
            res.forEach(ele => {
              expect(ele.user_id).to.be.equal(4);
              expect(ele.schedule_type).to.be.equal(1);
              expect(ele.group_year).to.be.equal(2018);
              expect(ele.group_month).to.be.equal(9);
            });
          })
      });
    });
  });
  describe('::getMonthScheduleNumList()', function () {
    describe('○正常テスト', function () {
      it('user_id -> 1(カメラマン)のとき指定年月毎に登録しているスケジュール数を取得する。', () => {
        const expect_data = [
          { group_month: 8, count: 10 }, 
          { group_month: 9, count: 10 },
          { group_month: 10, count: 10 }
        ];
        return scheduleRepository.getMonthScheduleNumList(user_data_cam.id, test_date.year())
          .then(res => {
            expect(res).to.deep.equal(expect_data);
          })
      });
    });
  });
  describe('::getSchedule()', function () {
    describe('○正常テスト', function () {
      it('user_id -> 1(カメラマン)且つ、スケジュールID:5を指定してデータを取得する。', () => {
        const expect_data = {
          id: 5,
          user_id: 1,
          schedule_type: 2,
          group_year: 2018,
          group_month: 8,
          date_key: dateHelper.createDate(2018, 8, 5).toDate(),
          time_from: "11:00",
          time_to: "17:00",
          shot_type: 1,
          event_name: "テストイベント5",
          event_url: "htt://c2link.com/detail/event/test",
          cost: 1000,
          num: 1,
          remarks: "カメラマンテストスケジュール"
        };
        return scheduleRepository.getSchedule(5)
        .then(res => {
          expect(expect_data.id).to.equal(res.id);
          expect(expect_data.user_id).to.equal(res.user_id);
          expect(expect_data.schedule_type).to.equal(res.schedule_type);
          expect(expect_data.group_year).to.equal(res.group_year);
          expect(expect_data.group_month).to.equal(res.group_month);
          expect(expect_data.date_key).to.equalDate(res.date_key);
          expect(expect_data.time_from).to.equal(res.time_from);
          expect(expect_data.time_to).to.equal(res.time_to);
          expect(expect_data.shot_type).to.equal(res.shot_type);
          expect(expect_data.event_name).to.equal(res.event_name);
          expect(expect_data.event_url).to.equal(res.event_url);
          expect(expect_data.cost).to.equal(res.cost);
          expect(expect_data.num).to.equal(res.num);
          expect(expect_data.remarks).to.equal(res.remarks);
        })
      });
    });
  });
  describe('::upsertSchedule()', function () {
    describe('○正常テスト', function () {
      it('指定したデータを登録する', () => {
        const expect_data = {
          user_id: 1,
          schedule_type: 2,
          group_year: 2018,
          group_month: 8,
          date_key: dateHelper.createDate(2018, 8, 5).toDate(),
          time_from: "11:00",
          time_to: "17:00",
          shot_type: 1,
          event_name: "テストイベント5",
          event_url: "htt://c2link.com/detail/event/test",
          cost: 1000,
          num: 1,
          remarks: "カメラマンテストスケジュール"
        };

        // ユーザーデータのみ作成
        return bp.genUserAndTags()
        .then(res => {
          return scheduleRepository.upsertSchedule(expect_data)
        })
        .then(res => {
          expect(res).to.be.true;
        })
      });
    });
  });
  describe('::deleteSchedule()', function () {
    describe('○正常テスト', function () {
      it('指定したデータ(前項の登録テストで作成したデータ))を削除する。', () => {
        return scheduleRepository.deleteSchedule(1)
        .then(res => {
          // 一件削除のため1を期待
          expect(res).to.equal(1);
        });
      })
    });
  });

})