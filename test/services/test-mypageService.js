const chai = require('chai'), should = chai.should(), assert = chai.assert;
const mypageService = require('../../services/mypageService');
const {req, res, next} = require('../expressModule/controllerHelper').getControllerArguments();
const errorHelper = require('../../common/helper/errorHelper');
const hashHelper = require('../../common/helper/hashHelper');
//const dateHelper = require('../../common/helper/dateHelper');
const moment = require('moment-timezone');
const calendarHelper = require('../../common/helper/calendarHelper');
const registerService = require('../../services/registerService');
const matchingService = require('../../services/matchingService');
const {sequelize, User, Schedule, Matching} = require('../../models');


describe('MypageService test', ()=>{
  const user1 = {user_key:"テストユーザーcos", user_type:1, password:"tesuto_user?", raw_password: "tesuto_user?"};
  const user2 = {user_key:"テストユーザーcam", user_type:2, password:"tesuto_user?", raw_password: "tesuto_user?"};


  const user1Schedules = [];
  const user2Schedules = [];
  before(async()=>{
    let user = await registerService.registerUser(user1);
    user = await User.findOne({where:{id:user.id}});
    user1.user_key = user.user_key;
    user1.id = user.id;
    user = await registerService.registerUser(user2);
    user = await User.findOne({where:{id:user.id}});
    user2.user_key = user.user_key;
    user2.id = user.id;

    // 10日前から10日後までの募集を作成
    const array = [];
    for(let i=-10;i<=10;i++){
      const date = moment().add({day:i});
      array.push(Schedule.create({
          user_id:user1.id,
          schedule_type: global.C2LINK.SCHEDULE_TYPE_ID_MAP.COSPLAYER,
          date_key: date.toDate(),
        }, {logging:false})
      ,Schedule.create({
          user_id:user2.id,
          schedule_type: global.C2LINK.SCHEDULE_TYPE_ID_MAP.CAMERAMAN,
          date_key: date.toDate(),
        },{logging:false})
      );
    }
    // それぞれの配列に分配
    // 0-9: 過去 10:当日, 11-20:未来
    await Promise.all(array).then(row=>{
      for(let i=0;i<row.length;){
        user1Schedules.push(row[i++]);
        user2Schedules.push(row[i++]);
      }
    });

  });

  describe('test : getNoReviewNum', ()=>{
    describe('レビューが0件の場合は0', ()=>{
      it('レビューが0件の場合は0', async()=>{
        const user1num = await mypageService.getNoReviewNum(user1.id);
        const user2num = await mypageService.getNoReviewNum(user2.id);
        assert.deepEqual(user1num, 0, "user1が0件");
        assert.deepEqual(user2num, 0, "user2が0件");
      });
    });

    describe('予定日を過ぎたマッチングがレビュー対象 (過去10件＋当日1件)*2 = 22', ()=>{
      before(async()=>{
        // お互いに全ての募集に応募する
        for(let schedule of user2Schedules){
          await matchingService.postRequest(user1.id, schedule.id);
        };
        for(let schedule of user1Schedules){
          await matchingService.postRequest(user2.id, schedule.id);
        };
      });
      it('予定日を過ぎたマッチングがレビュー対象 (過去10件＋当日1件)*2 = 22', async()=>{
        const user1num = await mypageService.getNoReviewNum(user1.id);
        const user2num = await mypageService.getNoReviewNum(user2.id);
        assert.deepEqual(user1num, 22, "user1が22件");  // 自分が送った分と送られた分で22件
        assert.deepEqual(user2num, 22, "user2が22件");  // 自分が送った分と送られた分で22件
      });
    });

  });
  describe('test : getMatchingRequestNum', ()=>{
    const user3 = {user_key:"テストユーザーcos", user_type:1, password:"tesuto_user?", raw_password: "tesuto_user?"};
    const user4 = {user_key:"テストユーザーcam", user_type:2, password:"tesuto_user?", raw_password: "tesuto_user?"};

    before(async()=>{
      let user = await registerService.registerUser(user3);
      user = await User.findOne({where:{id:user.id}});
      user3.user_key = user.user_key;
      user3.id = user.id;
      user = await registerService.registerUser(user4);
      user = await User.findOne({where:{id:user.id}});
      user4.user_key = user.user_key;
      user4.id = user.id;
    });
    it('マッチングが0件の場合は0', async()=>{
      const user3num = await mypageService.getMatchingRequestNum(user3.id);
      const user4num = await mypageService.getMatchingRequestNum(user4.id);
      assert.deepEqual(user3num, 0, "user1が0件");
      assert.deepEqual(user4num, 0, "user2が0件");
    });

    it('申請中のマッチングは21件', async()=>{
      const user1num = await mypageService.getMatchingRequestNum(user1.id);
      const user2num = await mypageService.getMatchingRequestNum(user2.id);
      assert.deepEqual(user1num, 21, "user1が21件");  // 自分が送った分と送られた分で22件
      assert.deepEqual(user2num, 21, "user2が21件");  // 自分が送った分と送られた分で22件
    });

    describe('承諾/拒否後に申請中のマッチング', async()=>{
      let user1Matchings = [];
      let user2Matchings = [];

      let user1consentCount = 0;  // ユーザー1が承認した数
      let user2rejectCount = 0;  // ユーザー2が拒否した数
      before(async()=>{
        user1Matchings = await Matching.findAll({where:{schedule_id: user1Schedules.map(v=>v.id)}, raw:true});
        user2Matchings = await Matching.findAll({where:{schedule_id: user2Schedules.map(v=>v.id)}, raw:true});
        console.log(user2Matchings);
        // ユーザー1が適当に承認する
        for(let user1matching of user1Matchings){
          if(Math.random() <= 0.5){
            await matchingService.postConsent(user1.id, user1matching.id);
            ++user1consentCount;
          }
        }
        // ユーザー2が適当に拒否する
        for(let user2matching of user2Matchings){
          if(Math.random() <= 0.5){
            await matchingService.postReject(user2.id, user2matching.id);
            ++user2rejectCount;
          }
        }
      });
      it(`申請中のマッチングはマッチング数-承諾/拒否数} ならOK`, async()=>{
        const user1num = await mypageService.getMatchingRequestNum(user1.id);
        const user2num = await mypageService.getMatchingRequestNum(user2.id);
        assert.deepEqual(user1num, user1Matchings.length-user1consentCount, `user1が違うよ`);
        assert.deepEqual(user2num, user2Matchings.length-user2rejectCount, `user2が違うよ`);
      });
    })


  });


});
