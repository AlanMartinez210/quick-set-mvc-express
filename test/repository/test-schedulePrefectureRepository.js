var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var schedulePrefectureRepository = require('../../repository/schedulePrefectureRepository')();
var basePattern = require("../expressModule/testData/basePattern");

describe('schedulePrefectureRepository test', function () {
  let bp = {};
  const test_schedule_id = 5;
  before(async () => {
    bp = new basePattern();
    await bp.genTestData();
  });

  describe('::getSchedulePrefsCd()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 5のとき指定した都道府県IDが取得できる。', () => {
        const expect_data = [
          { schedule_id: 5, prefecture_id: 14 },
          { schedule_id: 5, prefecture_id: 15 }
        ]
        return schedulePrefectureRepository.getSchedulePrefsCd(test_schedule_id)
        .then(res => {
          expect(expect_data).to.deep.equal(res);
        })
      });
    });
  });
  describe('::createSchedulePrefs()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 999のとき対象のスケジュールに紐づく都道府県データを登録できる。', () => {
        const test_Prefs_data = [
          { schedule_id: 999, prefecture_id: 15 },
          { schedule_id: 999, prefecture_id: 18 }
        ]
        return schedulePrefectureRepository.createSchedulePrefs(test_Prefs_data)
        .then(res => {
          expect(test_Prefs_data).to.deep.equal(res);
        })
      });
    });
  });
  describe('::deleteSchedulePref()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 999のとき対象のスケジュールに紐づく都道府県データを削除できる。', () => {
        const test_schedule_id = 999;
        return schedulePrefectureRepository.deleteSchedulePref(test_schedule_id)
        .then(res => {
          expect(2).to.be.equal(res);
        })
      });
    });
  });

})