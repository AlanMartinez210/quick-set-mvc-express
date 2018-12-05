var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var db = require("../../models/index");
var basePattern = require("../testdata/pattern/basePattern");

describe('tag model test', function () {
  let bp = {};
  before(() => {
    bp = new basePattern();
    return bp.genTestData();
  });

  describe('::upsertTag()', function () {
    describe('○正常テスト', function () {

      it('指定した条件でタグの登録が行える。', () => {
        const expect_data = {tag_id: 10};
        const test_tag_data = "テスト";        
        return db.Tag.upsertTag(test_tag_data)
        .then(instances => {
          expect(expect_data).to.deep.equal(instances);
        })
      });

      it('指定した条件でタグの更新が行える。', () => {
        const expect_data = {tag_id: 1};
        const test_tag_data = "カメラOK";        
        return db.Tag.upsertTag(test_tag_data)
        .then(instances => {
          expect(expect_data).to.deep.equal(instances);
        })
      });

    });
  });

  describe('::getTagByName()', function () {
    describe('○正常テスト', function () {

      it('指定したタグ名で対象のデータが取得できる。', () => {
        const expect_data = [
          { id: 1, tag_name: 'カメラOK', use_count: 16 },
          { id: 3, tag_name: 'データ一週間渡し', use_count: 12 },
          { id: 10, tag_name: 'テスト', use_count: 1 }
        ];
        const test_tag_data = ["テスト", "カメラOK", "データ一週間渡し"];        
        return db.Tag.getTagByName(test_tag_data)
        .then(instances => {
          instances.forEach((instance, i) => {
            expect(expect_data[i]).to.deep.equal(instance.toJSON());
          });
          
        })
      });

    });
  });

  describe('::getTagById()', function () {
    describe('○正常テスト', function () {

      it('指定したタグIDで対象のデータが取得できる。', () => {
        const expect_data = [
          { id: 1, tag_name: 'カメラOK', use_count: 16 },
          { id: 3, tag_name: 'データ一週間渡し', use_count: 12 },
          { id: 10, tag_name: 'テスト', use_count: 1 }
        ];
        const test_tag_data = [10, 1, 3];        
        return db.Tag.getTagById(test_tag_data)
        .then(instances => {
          instances.forEach((instance, i) => {
            expect(expect_data[i]).to.deep.equal(instance.toJSON());
          });
        })
      });

    });
  });

})