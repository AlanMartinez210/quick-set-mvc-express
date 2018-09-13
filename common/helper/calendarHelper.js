const koyomi = require('koyomi');
const dateHelper = require('./dateHelper');


/**
 * 当月のカレンダー情報を一ヶ月分取得します。
 *
 * @returns {array} calendarObjectArray
 */
exports.getCurrentCalendar = () => {
  const mDt = dateHelper.getDate();
  const cln = _getCalendar(mDt.year(), mDt.trueMonth());
  return cln;
}

/**
 * 指定した年月のカレンダー情報を取得します。
 *
 * @param {*} year
 * @param {*} month
 * @returns {array} calendarObjectArray
 */
exports.getCalendar = (year = 0, month = 0) => {
  if(isNaN(year) || (Number(year) < 1970 || Number(year) > 9999)) throw new Error('expect year param is 1970 to 9999');
  if(isNaN(month) || Number(month) < 1 || Number(month) > 12) throw new Error('expect month param is 1 to 12');

  const cln = _getCalendar(year, month);
  return cln;
}

/**
 * 指定した年月間を1日から月末まで取得します。
 *   - 週始め -> 日曜日
 *
 * @param {*} year
 * @param {*} month
 */
function _getCalendar(year, month){
  var arr = [];

  koyomi.startMonth = 1;
  koyomi.startWeek = '月';
  var list = koyomi.getCalendarData(year + "/" + month);

  // var holidayClass = '';
  list.forEach((ele, i) => {
    // ゴースト日ならスキップする。
    if (ele.ghost) return;
    
    const cln = {};
    cln.year = ele.year;
    cln.month = ele.month;
    cln.day = ele.day;
    cln.week = dateHelper.getWeek(ele.week);
    cln.holiday = ele.holiday;
		cln.schedule = [];
    
    arr.push(cln);
  });
  return arr;
}
