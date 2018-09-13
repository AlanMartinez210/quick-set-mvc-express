const abstractRepository = require('./abstractRepository');
const model = require('../models/schedule');

var repo;
module.exports = () =>{
  // リポジトリは2回以上作成しない
  repo = repo || Object.assign(scheduleRepository, abstractRepository(model))
  return repo;
}


const scheduleRepository = {
  
  /**
   * 指定した年月の対象ユーザーのスケジュールを取得します。
   *
   * @param {string} user_id 対象ユーザー
   * @param {moment} moment_date
   */
  getScheduleList: (user_id, moment_date, options = {}) => {
    options.where = {
      user_id: user_id,
      date_key: {
        [repo.Sequelize.Op.like]: year_month + "%"
      }
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
   getMonthScheduleNumList: (user_id, year) => {
     var query = `
      select substring(date_key,5,2) as month,
             count(1) as count
      from   schedules
      where  user_id = :user_id
      and    date_key like :year
      group by substring(date_key,5,2)
      ;`;
      var replacements = {user_id: user_id, year: year+'%' }
      return repo.querySelect(query, replacements);
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
