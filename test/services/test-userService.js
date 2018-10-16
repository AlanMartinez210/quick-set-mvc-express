const chai = require('chai');
const sinon = require('sinon');
const sequelize = require('../../models/index').sequelize;
const userService = require("../../services/userService");
const tagRepository = require("../../repository/tagRepository")();
const basePattern = require("../../testdata/pattern/basePattern");

const {
  req,
  res,
  next
} = require('../../testdata/expressModule/controllerHelper').getControllerArguments();
const globalValue = require("../../common/middleware/globalVariables")(req, res, next);

describe('userService test', () => {
  before(async () => {
    bp = new basePattern();
    await bp.genTestData();
  });

  describe('test : getProfileEditViewData', () => {
    it('都道府県、タグ1件取得ケース', async () => {
      // user.id=1のデータを書き換え
      await sequelize.query(`update users set tags = '[1]', prefectures = '[1]' where id = 1;`, {});
      // tagRepositoryのgetTagByIdのスタブを作成
      const stub = sinon.stub(tagRepository, "getTagById");
      stub.returns([{
        id: 1,
        tag_name: 'カメラOK',
        use_count: 1
      }]);
      // メソッド呼び出し
      let result = await userService.getProfileEditViewData(1);
      // assertion
      chai.assert.deepEqual(result, {
        icon_url: 'http://s3.c2link.test/test1.jpg',
        user_name: 'test_camera_man_1',
        email: 'test.cam_1_cs@c2link.mail.com',
        prefectures: ['北海道'],
        tags: ['カメラOK']
      });
      stub.restore();
    });

    it('タグ、都道府県2件取得ケース', async () => {
      // user.id=1のデータを書き換え
      await sequelize.query(`update users set tags = '[1,2]', prefectures = '[1,2]' where id = 1;`, {});
      // tagRepositoryのgetTagByIdのスタブを作成
      const stub = sinon.stub(tagRepository, "getTagById");
      stub.returns([{
        id: 1,
        tag_name: 'カメラOK',
        use_count: 1
      }, {
        id: 2,
        tag_name: '会員のみ',
        use_count: 2
      }]);
      // メソッド呼び出し
      let result = await userService.getProfileEditViewData(1);
      // assertion
      chai.assert.deepEqual(result, {
        icon_url: 'http://s3.c2link.test/test1.jpg',
        user_name: 'test_camera_man_1',
        email: 'test.cam_1_cs@c2link.mail.com',
        prefectures: ['北海道', '青森県'],
        tags: ['カメラOK', '会員のみ']
      });
      stub.restore();
    });
    it('ユーザーが存在しないケース', async () => {
      // tagRepositoryのgetTagByIdのスタブを作成
      const stub = sinon.stub(tagRepository, "getTagById");
      // メソッド呼び出し
      try {
        await userService.getProfileEditViewData(7);
        chai.assert.fail();
      } catch (e) {
        chai.assert.equal(e.window_msg, 'エラーが発生しました。');
      }
      stub.restore();
    });

    it('タグ未登録ケース', async () => {
      // user.id=1のデータを書き換え
      await sequelize.query(`update users set tags = '[]', prefectures = '[1,2]' where id = 1;`, {});
      // tagRepositoryのgetTagByIdのスタブを作成
      const stub = sinon.stub(tagRepository, "getTagById");
      stub.returns([]);
      // メソッド呼び出し
      let result = await userService.getProfileEditViewData(1);
      // assertion
      chai.assert.deepEqual(result, {
        icon_url: 'http://s3.c2link.test/test1.jpg',
        user_name: 'test_camera_man_1',
        email: 'test.cam_1_cs@c2link.mail.com',
        prefectures: ['北海道', '青森県'],
        tags: []
      });
      stub.restore();
    });

    it('都道府県未登録ケース', async () => {
      // user.id=1のデータを書き換え
      await sequelize.query(`update users set tags = '[]', prefectures = '[]' where id = 1;`, {});
      // tagRepositoryのgetTagByIdのスタブを作成
      const stub = sinon.stub(tagRepository, "getTagById");
      stub.returns([]);
      // メソッド呼び出し
      let result = await userService.getProfileEditViewData(1);
      // assertion
      chai.assert.deepEqual(result, {
        icon_url: 'http://s3.c2link.test/test1.jpg',
        user_name: 'test_camera_man_1',
        email: 'test.cam_1_cs@c2link.mail.com',
        prefectures: [],
        tags: []
      });
      stub.restore();
    });
    it('アイコンURL NULLケース', async () => {
      // user.id=1のデータを書き換え
      await sequelize.query(`update users set icon_url = null, user_name = 'test_camera_man_1', email = 'test.cam_1_cs@c2link.mail.com' where id = 1;`, {});
      // tagRepositoryのgetTagByIdのスタブを作成
      const stub = sinon.stub(tagRepository, "getTagById");
      stub.returns([]);
      // メソッド呼び出し
      let result = await userService.getProfileEditViewData(1);
      // assertion
      chai.assert.deepEqual(result, {
        icon_url: '',
        user_name: 'test_camera_man_1',
        email: 'test.cam_1_cs@c2link.mail.com',
        prefectures: [],
        tags: []
      });
      stub.restore();
    });
    it('ユーザー名 NULLケース', async () => {
      // user.id=1のデータを書き換え
      await sequelize.query(`update users set icon_url = 'http://s3.c2link.test/test1.jpg', user_name = null, email = 'test.cam_1_cs@c2link.mail.com' where id = 1;`, {});
      // tagRepositoryのgetTagByIdのスタブを作成
      const stub = sinon.stub(tagRepository, "getTagById");
      stub.returns([]);
      // メソッド呼び出し
      let result = await userService.getProfileEditViewData(1);
      // assertion
      chai.assert.deepEqual(result, {
        icon_url: 'http://s3.c2link.test/test1.jpg',
        user_name: '',
        email: 'test.cam_1_cs@c2link.mail.com',
        prefectures: [],
        tags: []
      });
      stub.restore();
    });
    it('メールアドレス NULLケース', async () => {
      // user.id=1のデータを書き換え
      await sequelize.query(`update users set icon_url = 'http://s3.c2link.test/test1.jpg', user_name = 'test_camera_man_1', email = null where id = 1;`, {});
      // tagRepositoryのgetTagByIdのスタブを作成
      const stub = sinon.stub(tagRepository, "getTagById");
      stub.returns([]);
      // メソッド呼び出し
      let result = await userService.getProfileEditViewData(1);
      // assertion
      chai.assert.deepEqual(result, {
        icon_url: 'http://s3.c2link.test/test1.jpg',
        user_name: 'test_camera_man_1',
        email: '',
        prefectures: [],
        tags: []
      });
      stub.restore();
    });
  });
});