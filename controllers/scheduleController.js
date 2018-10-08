const content_id = "schedule";

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
  render_obj.title = c2Util.isCosplayer(user_type) ? "募集の管理" : "予定の管理";

  Promise.all([
    scheduleService.getMonthSchedule(user_id, year, month),
    scheduleService.getMonthScheduleNumList(user_id, year),
  ]).then(results => {
    render_obj.bodyData = new scheduleVO.scheduleMonthList({
      calendar: results[0],
      select_year: year,
      select_month: month,
      month_schedule_num_arr: results[1]
    })
    res.render('mypage/schedule', render_obj);
  })
  .catch(err => {
    next(err);
  })
}

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
  render_obj.title = c2Util.isCosplayer(user_type) ? "募集の管理" : "予定の管理";

  Promise.all([
    scheduleService.getMonthSchedule(user_id, year, month),
    scheduleService.getMonthScheduleNumList(user_id, year),
  ])
  .then(results => {
    render_obj.bodyData = new scheduleVO.scheduleMonthList({
      calendar: results[0],
      select_year: year,
      select_month: month,
      month_schedule_num_arr: results[1]
    })
    res.render('../content/mypage/schedule/calendarSection', render_obj);
  })
  .catch(err => {
    next(err);
  })
}

/**
 * 対象ユーザーのスケジュール情報を取得します。
 *
 * @param {*} req
 * @param {*} res
 */
exports.getSchedule = (req, res, next)=>{
  const user_id = sessionHelper.getUserId(req);
  const schedule_id = req.params.schedule_id;

  scheduleService.getScheduleData(user_id, schedule_id)
  .then(results => {
    console.log(results);
    scheduleJson = new scheduleVO.scheduleInfo({
      date_key : results.date_key,
			shot_type : results.shot_type,
			prefectures : results.prefectures,
			tags : results.tags,
			coschara : results.coschara,
			cost : results.cost,
			num :  results.num,
			start_time : results.time_from,
			end_time : results.time_to,
			event_name : results.event_name,
			event_url : results.event_url,
			remark : results.remarks
    })
    res.json(scheduleJson);
  })
  .catch(err => {
    next(err);
  })
}

/**
 * スケジュールの登録/編集を行います。
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postSchedule = (req, res, next) => {
  const registData = req.form_data;
  registData.user_id = sessionHelper.getUserId(req);
  registData.schedule_type = sessionHelper.getUserType(req);

  scheduleService.upsertScheduleData(registData)
  .then(results=>{
    res.json({status:'success'});
  }).catch(err=>{
    console.log("cont err");
    next(err);
  });
}

/**
 * スケジュールの削除を行います。
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteSchedule = (req, res, next) => {
  const user_id = sessionHelper.getUserId(req);
  const date_key = req.form_data.date_key;

  scheduleService.deleteScheduleData(user_id, date_key)
  .then(results=>{
    res.json({status:'success'});
  }).catch(err=>{
    next(err);
  });
}
