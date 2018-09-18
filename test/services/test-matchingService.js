const chai = require('chai'), should = chai.should(), assert = chai.assert;
const matchingService = require('../../services/matchingService');
const {req, res, next} = require('../expressModule/controllerHelper').getControllerArguments();
const errorHelper = require('../../common/helper/errorHelper');
const hashHelper = require('../../common/helper/hashHelper');
const calendarHelper = require('../../common/helper/calendarHelper');
const seeder = require('../expressModule/seeder');

const registerService = require('../../services/registerService');
const {sequelize, User, Schedule, Matching} = require('../../models');


describe('MatchingService test', ()=>{
  let user1 = {user_key:"テストユーザーcos", user_type:1, password:"tesuto_user?", raw_password: "tesuto_user?"};
  let user2 = {user_key:"テストユーザーcam", user_type:2, password:"tesuto_user?", raw_password: "tesuto_user?"};

  const user1Schedules = [];
  const user2Schedules = [];
  const user1Matchings = [];
  const user2Matchings = [];
  before(async()=>{
    // テストユーザーの作成
    user1 = await seeder.createUser(user1);;
    user2 = await seeder.createUser(user2);;

    // 1ヶ月分の募集を作成
    const calendar = calendarHelper.getCurrentCalendar();
    const array = [];
    for(const row of calendar){
      const date = new Date(row.year, row.month-1, row.day);
      user1Schedules.push(
        await seeder.createSchedule({
          user_id:user1.id,
          schedule_type: user1.user_type,
          date_key: date,
        })
      );
      user2Schedules.push(
        await seeder.createSchedule({
          user_id:user2.id,
          schedule_type: user2.user_type,
          date_key: date,
        })
      )
    }

    for(let i=21;i<24;i++){ // 21-24は申請中
      user1Matchings.push(await matchingService.postRequest(user1.id, user2Schedules[i].id));
      user2Matchings.push(await matchingService.postRequest(user2.id, user1Schedules[i].id));
    }
  });
  after(async()=>{
    seeder.allDestroy();
  });

  describe('test : postRequest', ()=>{
    let user1RequestScheduleId,user2RequestScheduleId;
    let user1matching,user2matching;
    before(async()=>{
      user1RequestScheduleId = user2Schedules[0].id;  // user1が申請するスケジュールID
      user2RequestScheduleId = user1Schedules[0].id;  // user2が申請するマッチングID
      user1matching = await matchingService.postRequest(user1.id, user1RequestScheduleId);
      user2matching = await matchingService.postRequest(user2.id, user2RequestScheduleId);
    });
    it('正しく申請できること', async()=>{
      const matching1 = await Matching.findOne({where:{id:user1matching.id},attributes: {exclude:["id", "created_at", "updated_at"]}, raw:true});
      const matching2 = await Matching.findOne({where:{id:user2matching.id},attributes: {exclude:["id", "created_at", "updated_at"]}, raw:true});

      assert.deepEqual(matching1, {
        user_id: user1.id,
        to_user_id: user2.id,
        schedule_id: user1RequestScheduleId,
        status_id: global.C2LINK.MATCHING_STATUS_ID_MAP.REQUEST,
        last_message: null,
      }, '申請中になっていること');
      assert.deepEqual(matching2, {
        user_id: user2.id,
        to_user_id: user1.id,
        schedule_id: user2RequestScheduleId,
        status_id: global.C2LINK.MATCHING_STATUS_ID_MAP.REQUEST,
        last_message: null,
      }, '申請中になっていること');
    });

    it('申請中の依頼に申請したらエラーになること', async()=>{
      await matchingService.postRequest(user1.id, user2Schedules[21].id)
      .then(()=>{assert(false, '申請できちゃったよ')})
      .catch(err=>{
        const msg = new errorHelper().setWindowMsg('L00002');
        msg.window_msg = "すでに依頼済みの募集です";
        assert.deepEqual(err, msg);
      });
      await matchingService.postRequest(user2.id, user1Schedules[21].id)
      .then(()=>{assert(false, '申請できちゃったよ')})
      .catch(err=>{
        const msg = new errorHelper().setWindowMsg('L00002');
        msg.window_msg = "すでに依頼済みの募集です";
        assert.deepEqual(err, msg);
      });
    });
  });
  describe('test : postConsent', ()=>{
    let user1RequestScheduleId,user2RequestScheduleId;  // user1,user2が申請するスケジュール
    let user1matchingId,user2matchingId;                // user1,user2が承諾するスケジュール
    before(async()=>{
      user1RequestScheduleId = user2Schedules[1].id;
      user2RequestScheduleId = user1Schedules[1].id;
      await matchingService.postRequest(user1.id, user1RequestScheduleId);
      await matchingService.postRequest(user2.id, user2RequestScheduleId);
      const user1matching = await Matching.findOne({where:{schedule_id: user2RequestScheduleId}});
      const user2matching = await Matching.findOne({where:{schedule_id: user1RequestScheduleId}});
      user1matchingId = user1matching.id;
      user2matchingId = user2matching.id;
    });

    it('正しく承認できること', async()=>{
      await matchingService.postConsent(user1.id, user1matchingId);
      await matchingService.postConsent(user2.id, user2matchingId);
      const user1matching = await Matching.findOne({where:{schedule_id: user1RequestScheduleId}, attributes: {exclude:["id", "created_at", "updated_at"]},raw:true});
      const user2matching = await Matching.findOne({where:{schedule_id: user2RequestScheduleId}, attributes: {exclude:["id", "created_at", "updated_at"]},raw:true});
      await assert.deepEqual(user1matching, {
        user_id: user1.id,
        to_user_id: user2.id,
        schedule_id: user1RequestScheduleId,
        status_id: global.C2LINK.MATCHING_STATUS_ID_MAP.MATCHING,
        last_message: null,
      }, 'マッチング中になっていること');
      await assert.deepEqual(user2matching, {
        user_id: user2.id,
        to_user_id: user1.id,
        schedule_id: user2RequestScheduleId,
        status_id: global.C2LINK.MATCHING_STATUS_ID_MAP.MATCHING,
        last_message: null,
      }, 'マッチング中になっていること');

      await matchingService.postConsent(user1.id, user1matchingId)
      .then(()=>{assert(false, '申請できちゃったよ')})
      .catch(err=>{
        const msg = new errorHelper().setWindowMsg('L00002');
        msg.window_msg = "依頼の承諾に失敗しました";
        assert.deepEqual(err, msg, "マッチング済みの依頼の承諾時にエラーになること");
      });
      await matchingService.postConsent(user2.id, user2matchingId)
      .then(()=>{assert(false, '申請できちゃったよ')})
      .catch(err=>{
        const msg = new errorHelper().setWindowMsg('L00002');
        msg.window_msg = "依頼の承諾に失敗しました";
        assert.deepEqual(err, msg, "マッチング済みの依頼の承諾時にエラーになること");
      });
    });

    it("存在しない依頼の承諾時にエラーになること", async()=>{
      await matchingService.postConsent(user2.id, 0)
      .then(()=>{assert(false, '申請できちゃったよ')})
      .catch(err=>{
        const msg = new errorHelper().setWindowMsg('L00002');
        msg.window_msg = "依頼の承諾に失敗しました";
        assert.deepEqual(err, msg);
      });
    });
  });


  describe('test : postReject', ()=>{
    let user1RequestScheduleId,user2RequestScheduleId;  // user1,user2が申請するスケジュールID
    let user1matchingId,user2matchingId;                // user1,user2が拒否するマッチングID
    before(async()=>{
      user1RequestScheduleId = user2Schedules[2].id;
      user2RequestScheduleId = user1Schedules[2].id;
      await matchingService.postRequest(user1.id, user1RequestScheduleId);
      await matchingService.postRequest(user2.id, user2RequestScheduleId);
      const user1matching = await Matching.findOne({where:{schedule_id: user2RequestScheduleId}});
      const user2matching = await Matching.findOne({where:{schedule_id: user1RequestScheduleId}});
      user1matchingId = user1matching.id;
      user2matchingId = user2matching.id;
    });

    it('正しく拒否できること', async()=>{
      await matchingService.postReject(user1.id, user1matchingId);
      await matchingService.postReject(user2.id, user2matchingId);
      const user1matching = await Matching.findOne({where:{schedule_id: user1RequestScheduleId}, attributes: {exclude:["id", "created_at", "updated_at"]},raw:true});
      const user2matching = await Matching.findOne({where:{schedule_id: user2RequestScheduleId}, attributes: {exclude:["id", "created_at", "updated_at"]},raw:true});
      await assert.deepEqual(user1matching, {
        user_id: user1.id,
        to_user_id: user2.id,
        schedule_id: user1RequestScheduleId,
        status_id: global.C2LINK.MATCHING_STATUS_ID_MAP.REJECT,
        last_message: null,
      }, '拒否済になっていること');
      await assert.deepEqual(user2matching, {
        user_id: user2.id,
        to_user_id: user1.id,
        schedule_id: user2RequestScheduleId,
        status_id: global.C2LINK.MATCHING_STATUS_ID_MAP.REJECT,
        last_message: null,
      }, '拒否済になっていること');

      await matchingService.postReject(user1.id, user1matchingId)
      .then(()=>{assert(false, '申請できちゃったよ')})
      .catch(err=>{
        const msg = new errorHelper().setWindowMsg('L00002');
        msg.window_msg = "依頼の取消に失敗しました";
        assert.deepEqual(err, msg, "拒否済の依頼の拒否時にエラーになること");
      });
      await matchingService.postReject(user2.id, user2matchingId)
      .then(()=>{assert(false, '申請できちゃったよ')})
      .catch(err=>{
        const msg = new errorHelper().setWindowMsg('L00002');
        msg.window_msg = "依頼の取消に失敗しました";
        assert.deepEqual(err, msg, "拒否済の依頼の拒否時にエラーになること");
      });
    });

    it("存在しない依頼の拒否時にエラーになること", async()=>{
      await matchingService.postReject(user2.id, 0)
      .then(()=>{assert(false, '申請できちゃったよ')})
      .catch(err=>{
        const msg = new errorHelper().setWindowMsg('L00002');
        msg.window_msg = "依頼の取消に失敗しました";
        assert.deepEqual(err, msg);
      });
    });
  });


});
