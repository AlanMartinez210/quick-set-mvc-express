const koyomi = require('koyomi');
const dateHelper = require('./dateHelper');


/**
 * 当月のカレンダー情報を一ヶ月分取得します。
 *
 * @returns {array} calendarObjectArray
 */
exports.getCurrentCalendar = () => {
	const y = dateHelper.getCurrentYear();
	const m = dateHelper.getCurrentMonth();
  const cln = _getCalendar(y, m);
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
  let cln = {};
  if(year && month && month <= 12){
    const cln = _getCalendar(year, month);
    return cln;
  }
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
    
		var obj = dateHelper.dateToObject(ele, true);
    
    cln.date_key = obj.date;
    cln.year = obj.year;
    cln.month = obj.month;
    cln.day = obj.day;
    cln.week = obj.week;
		cln.schedule = [];
    
    arr.push(cln);
  });
  return arr;
}
