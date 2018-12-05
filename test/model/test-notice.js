var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var db = require("../../models/index");
var basePattern = require("../testdata/pattern/basePattern");
var dateHelper = require("../../common/helper/dateHelper");

describe('Notice model test', function () {
  let bp = {};
  before(() => {
    bp = new basePattern();
    return bp.genTestData();
  });

  describe('::getNoticeData()', function () {
    describe('○正常テスト', function () {
      it('指定した条件で期待したデータが取得できる。', () => {
        const expect_data = [{
            notice_date: dateHelper.createDate(2018, 11, 1),
            id: 1,
            type: 2,
            title: '新しいお知らせ1',
            content: 'お知らせ本部<br /><br />これは新しいおしらせです。<br />これは新しいおしらせです。<br />これは新しいおしらせです。',
            islogin: 1
          },
          {
            notice_date: dateHelper.createDate(2018, 11, 2),
            id: 2,
            type: 3,
            title: '新しいお知らせ2',
            content: 'お知らせ本部<br /><br />これは新しいおしらせです。<br />これは新しいおしらせです。<br />これは新しいおしらせです。',
            islogin: 0
          },
          {
            notice_date: dateHelper.createDate(2018, 11, 3),
            id: 3,
            type: 1,
            title: '新しいお知らせ3',
            content: 'お知らせ本部<br /><br />これは新しいおしらせです。<br />これは新しいおしらせです。<br />これは新しいおしらせです。',
            islogin: 1
          },
          {
            notice_date: dateHelper.createDate(2018, 11, 4),
            id: 4,
            type: 2,
            title: '新しいお知らせ4',
            content: 'お知らせ本部<br /><br />これは新しいおしらせです。<br />これは新しいおしらせです。<br />これは新しいおしらせです。',
            islogin: 0
          },
          {
            notice_date: dateHelper.createDate(2018, 11, 5),
            id: 5,
            type: 3,
            title: '新しいお知らせ5',
            content: 'お知らせ本部<br /><br />これは新しいおしらせです。<br />これは新しいおしらせです。<br />これは新しいおしらせです。',
            islogin: 1
          }
        ];
        return db.Notice.getNoticeData(true, 2018)
          .then(instances => {
            instances.forEach((element, i) => {
              const data = element.toJSON();
              expect(expect_data[i].id).to.equal(data.id);
              expect(expect_data[i].type).to.equal(data.type);
              expect(expect_data[i].title).to.equal(data.title);
              expect(expect_data[i].content).to.equal(data.content);
              expect(expect_data[i].islogin).to.equal(data.islogin);
            });
          })
      });
    });
  });

  describe('::getDataCount()', function () {
    describe('○正常テスト', function () {
      it('指定した条件で期待したデータ件数取得できる。', () => {
        return db.Notice.getDataCount(true, 2018)
        .then(all_data_num => {
          expect(10).to.equal(all_data_num);
        })
      });
    });
  });

})