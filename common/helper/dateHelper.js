const moment = require('moment-timezone');

const days_map = ['日','月','火','水','木','金','土']; // 曜日のマッピング

exports.getToday = (format = "YYYYMMDD") =>{
  return this.getDate([0, 0, 0], format);
}

/**
 * 指定した年、月、日の日付を取得します。
 *   - `safemode` falseにすると指定年月とフォーマットの形式を合わせません。
 *     - 例: 現在日付が2018年12月24日の場合
 *     - (true) getDate([2018, 11]) -> 201811
 *     - (false) getDate([2018, 11]) -> 20181124
 *     - このように指定がない部分は当日の日付で補います。
 *
 * @param {array} date [year, month(1-12), day(1-31)]
 * @param {string} format (default: YYYYMMDD)
 * @param {boolean} safemode (default: true)
 *
 */
exports.getDate = (date = [0,0,0], format = "YYYYMMDD", safemode = true)=>{

  var dt = _getDate();
  var year = date[0];
  var month = date[1];
  var day = date[2];

  // 月の設定を戻す
  if(month) month = parseInt(month) - 1;

  // すべて
  if(year && month && day){
    return dt.year(year).month(month).date(day).format(format);
  }
  // 年月
  else if(year && month){
    if(format.length >= 8 && safemode) format = "YYYYMM";
    return dt.year(year).month(month).format(format);
  }
  else if(year){
    if(format.length >= 6 && safemode) format = "YYYY";
    return dt.year(year).format(format);
  }
  else{
    return dt.format(format);
  }
}

/**
 * date型の日付を配列に変換します。
 *
 * @param {Date} date
 * @return {Array} [YYYY, MM, DD, HH, MM, SI]
 *
 */
exports.dateToArray = (date)=>{
  var date = _getDate(date);
  return [
    date.year(),
    date.month()+1,
    date.date(),
    date.hour(),
    date.minute(),
    date.second(),
  ];
}

/**
 * date型の日付をオブジェクトに分割します
 * @param {Moment} date
 * @param {Object} mode {diffMonth: 月を0-11に変換するために加算する数値 1-12の月情報の場合は-1を設定 }
 * @return {Object}  { key: '20180815', year: 2018, month: 8, day: 15, week: [3, "水"]}
 */
exports.dateToObject = (date, mode = {diffMonth:0})=>{
  if(mode.diffMonth && date.month !== undefined){
    date.month += mode.diffMonth;
  }
  var dt = _getDate(date);
  return {
    key: dt.format("YYYYMMDD"),
    year: dt.year(),
    month: dt.month()+1,
    day: dt.date(),
    week: [dt.day(), days_map[dt.day()]],
    hour: dt.hours(),
    min: dt.minutes(),
    sec: dt.seconds(),
  };
}

/**
 * 現在の日付から年情報を取得します。
 *
 * @param {integer} addYear 指定した数値を年に加算します。
 * @returns {string} YYYY
 */
exports.getCurrentYear = (addYear = 0) => {
	const d = _getDate();
	return d.add(addYear, 'y').year();
}

/**
 * 現在の日付から月情報を取得します。
 *
 * @param {integer} addMonth 指定した数値を月に加算します。
 * @returns {string} MM
 */
exports.getCurrentMonth = (addMonth = 0) => {
	const d = _getDate();
	return d.add(addMonth, 'M').month() + 1;
}

/**
 * 現在の日付から日にち情報を取得します。
 *
 * @param {integer} addDate 指定した数値を日付に加算します。
 * @returns {string} DD
 */
exports.getCurrentDay = (addDate = 0) => {
	const d = _getDate();
	return d.add(addDate, 'd').date();
}

/**
 * 日付が格納されたオブジェクトを取得します。
 *   - `default` 現在の日付を取得します。
 * @returns {Object} {year, month, day, h, m, s}
 */
function _getDate (datestr = {}) {
	return moment(datestr).tz("Asia/Tokyo");
}