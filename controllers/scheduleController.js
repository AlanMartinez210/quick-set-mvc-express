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
  render_obj.title = c2Util.getScheduleTitle(user_type);

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
  render_obj.title = c2Util.getScheduleTitle(user_type);

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
  const schedule_id = req.params.schedule_id;

  scheduleService.getScheduleData(schedule_id)
  .then(results => {
    const vo = {
      schedule_id: results.id,
      date_key : results.date_key,
			shot_type : results.shot_type,
			tags : results.tags,
			coschara : results.coschara,
			cost : results.cost,
			num :  results.num,
			start_time : results.time_from,
			end_time : results.time_to,
			event_name : results.event_name,
			event_url : results.event_url,
			remark : results.remarks
    }

    // 都道府県だけ別設定
    if(c2Util.isCosplayer(sessionHelper.getUserType(req))) {
      vo.prefectures = results.prefectures[0];
    }
    else{
      vo.prefectures_field = results.prefectures;
    }

    scheduleJson = new scheduleVO.scheduleInfo(vo)
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
  // 都道府県を纏める
  registData.prefectures = [];
  if(c2Util.isCosplayer(registData.schedule_type)){
    registData.prefectures.push(registData.prefecture);
  }
  else{
    registData.prefectures = registData.prefectures_field;
  }

  // タグを纏める
  registData.tags = registData.tag_field;

  // date_keyをmomentに変換する
  registData.date_key = dateHelper.getDateToStr(registData.date_key)

  scheduleService.upsertScheduleData(registData)
  .then(results => {
    res.json({status:'success'});
  }).catch(err => {
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
  console.log("aaaa");
  const schedule_id = req.form_data.schedule_id;
  console.log(schedule_id);
  scheduleService.deleteScheduleData(schedule_id)
  .then(results=>{
    res.json({status:'success'});
  }).catch(err=>{
    next(err);
  });
}
