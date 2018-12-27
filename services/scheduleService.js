const errorHelper = require('../common/helper/errorHelper');
const prefectureHelper = require("../common/helper/prefectureHelper");
const calendarHelper = require("../common/helper/calendarHelper");

const db = require("../models/index");

const c2Util = require("../services/c2link4DiService");

/**
 * 対象ユーザーの年月カレンダー一覧を取得します。
 *
 * @param {string} user_id 対象ユーザー
 * @param {number} year 年 YYYY
 * @param {number} month 月 MM 1-12
 *
 * @returns {object}
 */
exports.getMonthSchedule = async (user_id, year, month) => {
  const schedule_list = await db.Schedule.getScheduleList(user_id, year, month);
  const current_calendar = calendarHelper.getCalendar(year, month);
  return c2Util.bindSchedule(current_calendar, schedule_list);
}


/**
 * 対象ユーザーの指定した日付のスケジュール情報を取得します。
 *
 * @param {*} user_id
 * @param {*} date_key
 */
exports.getScheduleData = async (schedule_id) => {
  try{
    const options = {};
    options.include = [
      { model: db.Schedule_tag,
        include: [
          { model: db.Tag,
            attributes: ["tag_name"] }
        ]
      },
      { model: db.Schedule_prefecture }
    ];
    const instance = await db.Schedule.getSchedule(schedule_id, options);
    if(!instance) return Promise.reject(new errorHelper({code: "E00000"}));
    
    return instance.toJSON();
  }
  catch(err){
    return err;
  }
}
