const content_id = "schedule";

const db = require("../models/index");

const dateHelper = require('../common/helper/dateHelper');
const sessionHelper = require('../common/helper/sessionHelper');

const scheduleVO = require("../viewObjects/schedule");
const c2Util = require("../services/c2link4DiService");
const scheduleService = require("../services/scheduleService");

/**
 * 予定/募集の一覧の表示
 *   - ログインユーザーの当月のスケジュール付きカレンダーを取得します。
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = (req, res, next) => {

  const render_obj = res.render_obj;
  const user_id = sessionHelper.getUserId(req);
  const user_type = sessionHelper.getUserType(req);
  const today = dateHelper.getDate();
  const year = today.year();
  const month = today.trueMonth();

  render_obj.contentId = content_id;
  render_obj.title = c2Util.getScheduleTitle(user_type);
  render_obj.backBtn = c2Util.getBackMypageBtn();

  Promise.all([
    scheduleService.getMonthSchedule(user_id, year, month),
    db.Schedule.getMonthScheduleNumList(user_id, year),
  ]).then(results => {
    render_obj.bodyData = new scheduleVO.initView(results[0], results[1]);
    res.render('mypage/schedule', render_obj);
  })
  .catch(err => {
    next(err);
  });
};

/**
 * ログインユーザーの指定年月のスケジュール付きカレンダーを取得します。
 *
 * @param {*} req
 * @param {*} res
 */
exports.getSelectScheduleList = (req, res, next) =>{

  const render_obj = res.render_obj;
  const user_id = sessionHelper.getUserId(req);
  const user_type = sessionHelper.getUserType(req);
  const year = req.params.year;
  const month = req.params.month;

  render_obj.contentId = content_id;
  render_obj.title = c2Util.getScheduleTitle(user_type);

  Promise.all([
    scheduleService.getMonthSchedule(user_id, year, month),
    db.Schedule.getMonthScheduleNumList(user_id, year),
  ])
  .then(results => {
    render_obj.bodyData = new scheduleVO.getSelectScheduleList(results[0], results[1], year, month);
    res.render('../content/mypage/schedule/calendarSection', render_obj);
  })
  .catch(err => {
    next(err);
  });
};

/**
 * 対象ユーザーのスケジュール情報を取得します。
 *
 * @param {*} req
 * @param {*} res
 */
exports.getSchedule = (req, res, next)=>{
  const schedule_id = req.params.schedule_id;

  scheduleService.getScheduleData(schedule_id)
  .then(results => {
    res.json(new scheduleVO.getScheduleInfo(results));
  })
  .catch(err => {
    next(err);
  })
  
};

/**
 * スケジュールの登録を行います。
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.postSchedule = (req, res, next) => {
  const scheduleData = req.form_data;
  scheduleData.user_id = sessionHelper.getUserId(req);
  scheduleData.schedule_type = sessionHelper.getUserType(req);
  
  db.Schedule.createSchedule(scheduleData, db)
  .then(results => {
    res.json({status:'success'});
  }).catch(err => {
    next(err);
  });
};

/**
 * スケジュールの編集を行います。
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.putSchedule = (req, res, next) => {
  const scheduleData = req.form_data;
  scheduleData.user_id = sessionHelper.getUserId(req);
  scheduleData.schedule_type = sessionHelper.getUserType(req);

  scheduleService.updateScheduleData(scheduleData)
  .then(results => {
    res.json({status:'success'});
  }).catch(err => {
    next(err);
  });
};

/**
 * スケジュールの削除を行います。
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteSchedule = (req, res, next) => {
  const schedule_id = req.form_data.schedule_id;
  console.log(schedule_id);
  db.Schedule.deleteSchedule(schedule_id, db)
  .then(results=>{
    res.json({status:'success'});
  }).catch(err=>{
    next(err);
  });
};
