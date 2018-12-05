var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;
var db = require("../../models/index");
var basePattern = require("../testdata/pattern/basePattern");
var dateHelper = require("../../common/helper/dateHelper");

describe('user model test', function () {
  let bp = {};
	const test_user_id = 1;
	const test_user_email = 'test.cam_1_cs@c2link.mail.com';
	const test_user_user_key = 'test_camera_man_1';
	const test_user_password = '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e';

	global.APPENV = {EXPIRATION_DATE : 7};

	const common_expect_data = { 
		expiration_date: null,
		id: 1,
		user_key: 'test_camera_man_1',
		user_name: 'test_camera_man_1',
		password: '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e',
		email: 'test.cam_1_cs@c2link.mail.com',
		icon_url: 'http://s3.c2link.test/test1.jpg',
		user_type: 2,
		tags: [ 2, 3, 4 ],
    prefectures: [ 14, 15 ],
    bg_image_url: null
	};

  before(() => {
    bp = new basePattern();
    return bp.genTestData();
  });

  describe('::getUserById()', function () {
    describe('○正常テスト', function () {
      it('user_id -> 1のとき指定したユーザーが取得できる。', () => {
        
        return db.User.getUserById(test_user_id)
        .then(instance => {
					const data = instance.toJSON();
					// 日付照合が出来ないため、意図的に消す
					delete data.createdAt;
					delete data.updatedAt;
          expect(common_expect_data).to.deep.equal(data);
        })
      });
    });
	});
	
	describe('::getUserByUserKeyOrEmail()', function () {
    describe('○正常テスト', function () {
      it('user_key -> test_camera_man_1のとき指定したユーザーが取得できる。', () => {
        return db.User.getUserByUserKeyOrEmail(test_user_user_key, test_user_password)
        .then(instances => {
					const data = instances.map(v => v.toJSON());
					// 日付照合が出来ないため、意図的に消す
					delete data[0].createdAt;
					delete data[0].updatedAt;
          expect(common_expect_data).to.deep.equal(data[0]);
        })
      });
    });
	});
	
	describe('::getUserByUserKeyOrEmail()', function () {
    describe('○正常テスト', function () {
      it('email -> test.cam_1_cs@c2link.mail.comのとき指定したユーザーが取得できる。', () => {
        return db.User.getUserByUserKeyOrEmail(test_user_email, test_user_password)
        .then(instances => {
					const data = instances.map(v => v.toJSON());
					// 日付照合が出来ないため、意図的に消す
					delete data[0].createdAt;
					delete data[0].updatedAt;
          expect(common_expect_data).to.deep.equal(data[0]);
        })
      });
    });
	});

	describe('::getUserByEmail()', function () {
    describe('○正常テスト', function () {
      it('email -> test.cam_1_cs@c2link.mail.comのとき指定したユーザーが取得できる。', () => {
        return db.User.getUserByEmail(test_user_email)
        .then(instances => {
					const data = instances.map(v => v.toJSON());
					// 日付照合が出来ないため、意図的に消す
					delete data[0].createdAt;
					delete data[0].updatedAt;
          expect(common_expect_data).to.deep.equal(data[0]);
        })
      });
    });
	});
	
	describe('::getUserAll()', function () {
    describe('○正常テスト', function () {
      it('ユーザーデータが6件取得できる。', () => {
        return db.User.getUserAll()
        .then(instances => {
          expect(6).to.deep.equal(instances.length);
        })
      });
    });
	});

	describe('::getUserAll()', function () {
    describe('○正常テスト', function () {
      it('ユーザーデータが6件取得できる。', () => {
        return db.User.getUserAll()
        .then(instances => {
          expect(6).to.deep.equal(instances.length);
        })
      });
    });
	});

	describe('::createUser()', function () {
    describe('○正常テスト', function () {
      it('想定したユーザーデータが作成できる。', () => {
				const test_data = {
					user_name: 'test_camera_man_7',
					password: '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e',
					email: 'test.cam_7_cs@c2link.mail.com',
					icon_url: 'http://s3.c2link.test/test7.jpg',
					user_type: 2,
					tags: [ 2, 3, 4 ],
					prefectures: [ 14, 15 ]
				}

				const expect_data = { 
					expiration_date: undefined,
					id: 7,
					user_name: 'test_camera_man_7',
					password: '0b14d501a594442a01c6859541bcb3e8164d183d32937b851835442f69d5c94e',
					email: 'test.cam_7_cs@c2link.mail.com',
					icon_url: 'http://s3.c2link.test/test7.jpg',
					user_type: 2,
					tags: [ 2, 3, 4 ],
					prefectures: [ 14, 15 ]
				}
        return db.User.createUser(test_data)
        .then(instance => {
					const data = instance.toJSON();
					// 日付照合が出来ないため、意図的に消す
					delete data.createdAt;
					delete data.updatedAt;
          expect(expect_data).to.deep.equal(data);
        })
      });
    });
	});

	describe('::deleteUser()', function () {
    describe('○正常テスト', function () {
			it('指定したユーザーに有効期限日を設定し、更新件数1件が取得できる。', () => {
        return db.User.deleteUser(test_user_id)
        .then(proc_num => {
          expect(1).to.deep.equal(proc_num[0]);
        })
      });
    });
	});

	describe('::deleteExpirationDate()', function () {
    describe('○正常テスト', function () {
			it('指定したユーザーに有効期限日を削除し、更新件数1件が取得できる。', () => {
        return db.User.deleteExpirationDate(test_user_id)
        .then(proc_num => {
          expect(1).to.deep.equal(proc_num[0]);
        })
      });
    });
	});

	describe('::updateExpirationDate()', function () {
    describe('○正常テスト', function () {
			it('指定したユーザーに有効期限日を更新し、更新件数1件が取得できる。', () => {
        return db.User.updateExpirationDate(test_user_id, dateHelper.getDate())
        .then(proc_num => {
          expect(1).to.deep.equal(proc_num[0]);
        })
      });
    });
  });
  
	describe('::getProfileEditViewData()', function () {
    const expect_data = { 
      user_name: 'test_camera_man_1',
      email: 'test.cam_1_cs@c2link.mail.com',
      icon_url: 'http://s3.c2link.test/test1.jpg',
      tags: [ 2, 3, 4 ],
      prefectures: [ 14, 15 ],
    };
  
    it('user_id -> 1のとき指定したユーザーが取得できる。', () => {
      return db.User.getProfileEditViewData(1)
      .then(instance => {
        const data = instance.toJSON();
        // 日付照合が出来ないため、意図的に消す
				delete data.createdAt;
        delete data.updatedAt;
        // 有効期限が取得されるため、意図的に消す
        delete data.expiration_date;
        expect(expect_data).to.deep.equal(data);
      })
    });
    it('存在しないユーザーIDを指定した場合にエラーになる。', () => {
      return db.User.getProfileEditViewData(100)
      .catch(err=>{
        expect(err.window_msg).to.equal('エラーが発生しました。');
      })
    });
	});

})