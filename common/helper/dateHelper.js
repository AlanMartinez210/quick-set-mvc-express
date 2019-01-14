const moment = require('moment-timezone');
moment.locale("ja");
const days_map = ['日','月','火','水','木','金','土']; // 曜日のマッピング

// moment拡張
(function(){
  // ViewObjectで使うDateTime
  moment.prototype.getDateTimeInfo = function(){
    return {
      key: this.format("L"),
      year: this.year(),
      month: this.trueMonth(),
      day: this.date(),
      week: this.format('ddd'),
      hour: this.hour(),
      minute: this.minute(),
      seconds: this.second(),
    };
  };
  // ViewObjectで使うDate
  moment.prototype.getDateInfo = function(){
    return {
      key: this.format("L"),
      year: this.year(),
      month: this.trueMonth(),
      day: this.date(),
      week: this.format('ddd')
    };
  };
})();

/**
 * Dateからmomentオブジェクトを取得します。
 *
 * @param {Date} sequelize_date
 * @param {Boolean} time_expect -> trueなら日付情報を未設定にする
 */
exports.getDate = (sequelize_date = new Date(), time_expect = false) => {
  if(!(sequelize_date instanceof Date)) throw new Error('type of Date is expected.');
  if(time_expect) sequelize_date = new Date(`${sequelize_date.getFullYear()}/${sequelize_date.getMonth() + 1}/${sequelize_date.getDate()}`)
  return _getDate(sequelize_date);
}

/**
 * 日付情報のみを設定した日付を取得します。
 * ※ 時間は(00:00:00+9:00)がデフォルトです
 *
 * @param {Date} sequelize_date
 */
exports.getDateOnly = (sequelize_date = new Date()) => {
  return this.getDate(sequelize_date, true);
}

/**
 * 日付変換可能な日付文字列のみmomentオブジェクトに変換します。
 *
 * @param {*} dateStr
 */
exports.getDateToStr = (dateStr = "") => {
  dateStr = getMomentString(dateStr);
  if(!this.isValidString(dateStr)) throw new Error('expect date string format');
  return _getDate(dateStr);
}

/**
 * 文字列がmomentに変換可能かどうかチェックする
 * 空文字の場合はfalseを返す。
 */
exports.isValidString = (dateStr) => {
  return dateStr ? moment(getMomentString(dateStr)).isValid() : false;
}


/**
 * 新規にmoment dateを取得します。
 *
 * @param {*} year
 * @param {*} month
 * @param {*} day
 */
exports.createDate = (year = 0, month = 0, day = 1) => {
  if(isNaN(year) || (Number(year) < 1970 || Number(year) > 9999)) throw new Error('expect year param is 1970 to 9999');
  if(isNaN(month) || Number(month) < 1 || Number(month) > 12) throw new Error('expect month param is 1 to 12');
  if(isNaN(day) || Number(day) < 1 || Number(day) > 31) throw new Error('expect day param is 1 to 31');
  const dt = new Date(`${year}/${month}/${day}`);
  return _getDate(dt);
}

/**
 * week_idから曜日を取得します。
 *
 * @param {*} week_id #0-6
 */
exports.getWeek = (week_id) => {
  var regex = new RegExp(/^[0-6]$/);
  if(!regex.test(week_id)) throw new Error('expect param is 0 to 6');
  return days_map[week_id];
}

/**
 * 一番過去の日付を取得します
 */
exports.max = (...args)=>{
  return moment.max(args);
}

/**
 * 日付が格納されたオブジェクトを取得します。
 *   - `default` 現在の日付を取得します。
 * @returns {Date} {year, month, day, h, m, s}
 */
function _getDate (datestr, locale = "ja") {
  moment.locale(locale);
  const mDt =  moment(datestr).tz("Asia/Tokyo");
  // 拡張メソッドを定義
  mDt.trueMonth = function(addZero = false){
    return this.month() + 1;
  }
	return mDt
}

/**
 * 日付文字列からmomentで解析可能な日付文字列を返す
 * @param {*} dateStr
 */
function getMomentString(dateStr){
  // YYYYMMDDに変換
  return dateStr.replace(/\//g, "");
}
