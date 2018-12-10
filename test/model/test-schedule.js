global.APPENV = {
  PAGE_COUNT: 10
}

var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var db = require("../../models/index");
var dateHelper = require("../../common/helper/dateHelper");
var basePattern = require("../testdata/pattern/basePattern");

describe('Schedule model test', function () {
  let bp = {};
  const test_user_id = 1;
  const test_schedule_id = 5;
  before(() => {
    bp = new basePattern();
    return bp.genTestData();
  });

  describe('::getScheduleList()', function () {
    describe('○正常テスト', function () {
      it('指定した条件で期待したデータ件数分を取得できる。', () => {
        const expect_data = 10
        return db.Schedule.getScheduleList(test_user_id, 2018, 9)
          .then(instances => {
            expect(expect_data).to.deep.equal(instances.length);
          })
      });
    });
  });

  describe('::getSchedule()', function () {
    describe('○正常テスト', function () {
      it('指定した条件で期待したデータを取得できる。', () => {
        const expect_data = {
          id: 5,
          user_id: 1,
          schedule_type: 2,
          group_year: 2018,
          group_month: 8,
          time_from: '11:00',
          time_to: '17:00',
          shot_type: 1,
          event_name: 'テストイベント1',
          event_url: 'htt://c2link.com/detail/event/test',
          cost: '1000',
          num: '1',
          cos_chara: null,
          remarks: 'カメラマンテストスケジュール',
          Schedule_tags: [{
              schedule_id: 5,
              tag_id: 1,
              Tag: {
                id: 1,
                tag_name: 'カメラOK',
                use_count: 15
              }
            },
            {
              schedule_id: 5,
              tag_id: 2,
              Tag: {
                id: 2,
                tag_name: '会員のみ',
                use_count: 1
              }
            },
            {
              schedule_id: 5,
              tag_id: 3,
              Tag: {
                id: 3,
                tag_name: 'データ一週間渡し',
                use_count: 12
              }
            }
          ],
          Schedule_prefectures: [{
              prefecture_name: '神奈川県',
              schedule_id: 5,
              prefecture_id: 14
            },
            {
              prefecture_name: '新潟県',
              schedule_id: 5,
              prefecture_id: 15
            }
          ]
        }
        return db.Schedule.getSchedule(db, test_schedule_id)
          .then(instance => {
            const data = instance.toJSON();
            console.log('data: ', data.Schedule_tags);
            // 日付照合が出来ないため、意図的に消す
            delete data.createdAt;
            delete data.updatedAt;
            delete data.date_key;
            // expect(expect_data).to.deep.equal(data);
          })
      });
    });
  });

  describe('::getMonthScheduleNumList()', function () {
    describe('○正常テスト', function () {
      it('指定した条件で期待したデータを取得できる。', () => {
        const expect_data = [{
            group_month: 8,
            count: 10
          },
          {
            group_month: 9,
            count: 10
          },
          {
            group_month: 10,
            count: 10
          }
        ];
        return db.Schedule.getMonthScheduleNumList(test_user_id, 2018)
          .then(instances => {
            expect(expect_data).to.deep.equal(instances);
          })
      });
    });
  });

  describe('::createSchedule()', function () {
    describe('○正常テスト', function () {

      it('指定した条件で期待したデータを取得できる。(新規作成)', () => {
        const expect_data = {
          id: 181,
          user_id: 1,
          schedule_type: 2,
          time_from: '11:00',
          time_to: '17:00',
          shot_type: 1,
          event_name: 'テストイベント1',
          event_url: 'htt://c2link.com/detail/event/test',
          cost: '1000',
          num: '1',
          cos_chara: null,
          remarks: 'カメラマンテストスケジュール',
          Schedule_tags: [
            { schedule_id: 181, tag_id: 10 },
            { schedule_id: 181, tag_id: 5 },
            { schedule_id: 181, tag_id: 12 }
          ],
          Schedule_prefectures: [
            { prefecture_name: '神奈川県', schedule_id: 181, prefecture_id: 14 },
            { prefecture_name: '新潟県', schedule_id: 181, prefecture_id: 15 }
          ]
        };
        
        const test_schedule_data = {
          user_id: 1,
          date_key: dateHelper.createDate(2018, 10, 11),
          schedule_type: 2,
          time_from: '11:00',
          time_to: '17:00',
          shot_type: 1,
          event_name: 'テストイベント1',
          event_url: 'htt://c2link.com/detail/event/test',
          cost: '1000',
          num: '1',
          cos_chara: null,
          remarks: 'カメラマンテストスケジュール',
          tag_field: ["コンデシOK", "夜間撮影あり", "性別不問"],
          prefecture_field: [14, 15]
        };
        return db.Schedule.createSchedule(test_schedule_data, db)
          .then(instance => {
            const data = instance.toJSON();
            // 日付照合が出来ないため、意図的に消す
            delete data.createdAt;
            delete data.updatedAt;
            delete data.date_key;
            expect(expect_data).to.deep.equal(data);
          })
      });
    });
  });
  
  describe('::updateSchedule()', function () {
    describe('○正常テスト', function () {
      it('指定した条件で期待したデータを取得できる。(更新)', () => {
        const test_schedule_data = {
          schedule_id: 181,
          user_id: 1,
          date_key: dateHelper.createDate(2018, 10, 11),
          schedule_type: 2,
          time_from: '10:00',
          time_to: '21:00',
          shot_type: 1,
          event_name: 'テストイベント2',
          event_url: 'htt://c2link.com/detail/event/test',
          cost: '2000',
          num: '2',
          cos_chara: null,
          remarks: 'カメラマンテストスケジュール2',
          tag_field: ["コンデシOK", "衣装複数あり"],
          prefecture_field: [14, 13]
        };
        return db.Schedule.updateSchedule(test_schedule_data, db)
        .then(instance => {
          expect(1).to.deep.equal(instance[0]);
        })
      });
    });
  });

  describe('::deleteSchedule()', function () {
    describe('○正常テスト', function () {
      it('指定したスケジュールIDのデータと関連データを削除する。', () => {
        const test_schedule_id = 181;
        return db.Schedule.deleteSchedule(test_schedule_id, db)
        .then(instance => {
          expect(1).to.deep.equal(instance);
        })
      });
    });
  });

});