var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var scheduleTagRepository = require('../../repository/scheduleTagRepository')();
var basePattern = require("../../testdata/pattern/basePattern");

describe('scheduleTagRepository test', function () {
  let bp = {};
  const test_schedule_id = 5;
  before(() => {
    bp = new basePattern();
    return bp.genTestData();
  });

  describe('::getScheduleTag()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 5のとき指定したタグIDが取得できる。', () => {
        const expect_data = [
          { schedule_id: 5, tag_id: 1 },
          { schedule_id: 5, tag_id: 2 },
          { schedule_id: 5, tag_id: 3 }
        ]
        return scheduleTagRepository.getScheduleTag(test_schedule_id)
        .then(res => {
          expect(expect_data).to.deep.equal(res);
        })
      });
    });
  });
  describe('::createScheduleTag()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 999のとき対象のスケジュールに紐づくタグデータを登録できる。', () => {
        const test_tag_data = [
          { schedule_id: 999, tag_id: 1 },
          { schedule_id: 999, tag_id: 2 },
          { schedule_id: 999, tag_id: 3 }
        ]
        return scheduleTagRepository.createScheduleTag(test_tag_data)
        .then(res => {
          expect(test_tag_data).to.deep.equal(res);
        })
      });
    });
  });
  describe('::deleteScheduleTag()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 999のとき対象のスケジュールに紐づくタグデータを削除できる。', () => {
        const test_tag_id = 999;
        return scheduleTagRepository.deleteScheduleTag(test_tag_id)
        .then(res => {
          expect(3).to.be.equal(res);
        })
      });
    });
  });

})