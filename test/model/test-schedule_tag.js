var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var db = require("../../models/index");
var basePattern = require("../testdata/pattern/basePattern");

describe('Schedule_tag model test', function () {
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
					{ 
						schedule_id: 5,
						tag_id: 1,
						Tag: { id: 1, tag_name: 'カメラOK', use_count: 15 } 
					},
					{ 
						schedule_id: 5,
						tag_id: 2,
						Tag: { id: 2, tag_name: '会員のみ', use_count: 1 }
					},
					{ 
						schedule_id: 5,
						tag_id: 3,
						Tag: { id: 3, tag_name: 'データ一週間渡し', use_count: 12 }
					}
				];
        return db.Schedule_tag.getScheduleTags(test_schedule_id)
        .then(instances => {
					const tagData = instances.map(v => v.toJSON());
          expect(expect_data).to.deep.equal(tagData);
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
				const expect_data = [
					{ schedule_id: 999, tag_id: 1 },
					{ schedule_id: 999, tag_id: 2 },
					{ schedule_id: 999, tag_id: 3 }
				];
        return db.Schedule_tag.createScheduleTag(test_tag_data)
        .then(instances => {
					const registData = instances.map(v => v.toJSON());
					expect(expect_data).to.deep.equal(registData);
        })
      });
    });
  });
  describe('::deleteScheduleTag()', function () {
    describe('○正常テスト', function () {
      it('schedule_id -> 999のとき対象のスケジュールに紐づくタグデータを削除できる。', () => {
				const test_schedule_id = 999;
				const expect_data = 3;
        return db.Schedule_tag.deleteScheduleTag(test_schedule_id)
        .then(delete_num => {
          expect(expect_data).to.be.equal(delete_num);
        })
      });
    });
  });

})