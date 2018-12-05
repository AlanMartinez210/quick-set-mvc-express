var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var db = require("../../models/index");
var basePattern = require("../testdata/pattern/basePattern");

describe('Schedule_prefecture model test', function () {
  let bp = {};
  const test_schedule_id = 5;
  before(() => {
    bp = new basePattern();
    return bp.genTestData();
  });

  describe('::getScheduleTag()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 5のとき指定した都道府県IDが取得できる。', () => {
        const expect_data = [ 
          { 
            prefecture_name: '神奈川県',
            schedule_id: 5,
            prefecture_id: 14
          },
          { 
            prefecture_name: '新潟県',
            schedule_id: 5,
            prefecture_id: 15
          }
        ];
        return db.Schedule_prefecture.getSchedulePrefsCd(test_schedule_id)
        .then(instances => {
          const data = instances.map(v => v.toJSON());
          expect(expect_data).to.deep.equal(data);
        })
      });
    });
  });

  describe('::createSchedulePrefs()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 999のとき対象のスケジュールに紐づく都道府県データを登録できる。', () => {
        const test_pref_data = [
          { schedule_id: 999, prefecture_id: 14 },
          { schedule_id: 999, prefecture_id: 15 }
				]
				const expect_data = [
					{ schedule_id: 999, prefecture_id: 14, prefecture_name: "神奈川県"},
					{ schedule_id: 999, prefecture_id: 15, prefecture_name: "新潟県" },
				];
        return db.Schedule_prefecture.createSchedulePrefs(test_pref_data)
        .then(instances => {
					const registData = instances.map(v => v.toJSON());
					expect(expect_data).to.deep.equal(registData);
        })
      });
    });
  });

  describe('::deleteSchedulePref()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 999のとき対象のスケジュールに紐づく都道府県データを削除できる。', () => {
				const test_schedule_id = 999;
				const expect_data = 2;
        return db.Schedule_prefecture.deleteSchedulePref(test_schedule_id)
        .then(delete_num => {
          expect(expect_data).to.be.equal(delete_num);
        })
      });
    });
  });

})