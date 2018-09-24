const abstractRepository = require('./abstractRepository');

var repo;
module.exports = () =>{
  // リポジトリは2回以上作成しない
  repo = repo || Object.assign(scheduleRepository, abstractRepository("Schedule"))
  return repo;
}


const scheduleRepository = {
  
  /**
   * 指定した年月の対象ユーザーのスケジュールを取得します。
   *
   * @param {string} user_id 対象ユーザー
   * @param {moment} moment_date
   */
  getScheduleList: (user_id, year, month, options = {}) => {
    options.where = {
      user_id: user_id,
      group_year: year,
      group_month: month,
    };
    return repo.findAll(options);
  },

  /**
   * 指定した年の対象ユーザーの月別のスケジュール投稿数を取得します
   *
   * @param {string} user_id 対象ユーザー
   * @param {number} year 年 YYYY
   *
   * @returns {Array}
   *
   */
  getMonthScheduleNumList: (user_id, year, options = {}) => {
    options.where = {
      user_id: user_id,
      group_year: year
    };
    options.attributes = ["group_month", [repo.Sequelize.fn('count', "id"), 'count']]
    options.group = ["group_year", "group_month"]
    return repo.findAll(options);
  },

  /**
   * 対象ユーザーのスケジュールを取得します。
   *
   * @param {string} schedule_id スケジュールID
   * @param {calendar.date_key} date_key YYYYMMDD
   */
  getSchedule: (schedule_id, options = {}) => {
    options.where = {
      id: schedule_id,
    };
    return repo.findOne(options);
  },

  /**
   * スケジュールの登録/更新を行います。
   */
  upsertSchedule: (scheduleObj, options = {}) => {
    return repo.upsert(scheduleObj, options);
  },

  /**
   * 対象のスケジュールの削除を行います。
   */
  deleteSchedule: (schedule_id, options = {}) => {
    options.where = {
      id: schedule_id
    }
    return repo.destroy(options);
  }
}
