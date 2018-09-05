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
  if(calendar.length <= 0 ||  schedule.length <= 0) return calendar;

  calendar.forEach((ele, i) => {
    const key = ele.date_key
    const result = schedule.filter(obj=>{
      return obj.date_key == key;
    })
    ele.schedule = result;
  });

  return calendar;
}


