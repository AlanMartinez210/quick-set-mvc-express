const chai = require('chai');
const sinon = require('sinon');
const sequelize = require('../../models/index').sequelize;
const userService = require("../../services/userService");
const basePattern = require("../testdata/pattern/basePattern");

// const {
//   req,
//   res,
//   next
// } = require('../testdata/expressModule/controllerHelper').getControllerArguments();
// const globalValue = require("../../common/middleware/globalVariables")(req, res, next);

describe('userService test', () => {
  before(async () => {
    bp = new basePattern();
    await bp.genTestData();
  });

  // describe('test : updateProfileData', () => {
  //   it('ケース1 タグを登録', async () => {
  //     const result = await userService.updateProfileData({
  //       id: 1,
  //       user_name: 'たかしくん',
  //       email: 'henkougo@mail.co.jp',
  //       tags: ['あああ', 'いいい'],
  //       prefectures: ['鹿児島県','沖縄県']
  //     });
  //     const updatedData = await userRepository.findOne({attributes:['id','user_name','email', 'tags', 'prefectures'], where:{
  //       id: 1
  //     }});
  //     console.log(updatedData);
  //     // assertion
  //     chai.assert.deepEqual(updatedData, {
  //       id: 1,
  //       user_name: 'たかしくん',
  //       email: 'henkougo@mail.co.jp',
  //       tags: [10, 11],
  //       prefectures: [46, 47],
  //     });
  //   });
  // });
});