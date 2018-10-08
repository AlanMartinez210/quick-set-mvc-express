const dateHelper = require('../common/helper/dateHelper'); 

// アプリケーション依存処理の定義を行います。

/**
 * ユーザー種別がコスプレイヤーの場合trueを返します。
 * 
 * @param {session.user_type} user_type 
 */
exports.isCosplayer = (user_type) => {
  return Number(user_type) === 1 ? true : false;
}

/**
 * ユーザー種別がカメラマンの場合trueを返します。
 * 
 * @param {session.user_type} user_type 
 */
exports.isCameraman = (user_type) => {
  return Number(user_type) === 2 ? true : false;
}

/**
 * カレンダーにスケジュール情報をバインドします。
 * 
 * @param {array} calendar
 * @param {array} schedule
 */
exports.bindSchedule = (calendar, schedule) => {
  calendar.forEach(ele => {
    // Date型を前提でフィルター処理を行う。
    const result = schedule.filter(obj=>{
      const cdt = dateHelper.createDate(ele.year, ele.month, ele.day);
      const sdt = dateHelper.getDate(obj.date_key);
      return cdt.isSame(sdt);
    })
    ele.schedule = result;
  });
  return calendar;
}




