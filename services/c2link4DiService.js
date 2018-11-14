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
      return cdt.format("YYYYMMDD") == sdt.format("YYYYMMDD");
    })
    ele.schedule = result;
  });
  return calendar;
}

/**
 * 種別によるスケジュールコンテンツのタイトルを取得します。
 * 
 * @param {*} user_type 
 */
exports.getScheduleTitle = (user_type) => {
  return this.isCosplayer(user_type) ? "募集の管理" : "予定の管理";
}

/**
 * 種別による募集/予定一覧コンテンツのタイトルを取得します。
 * 
 * @param {*} user_type 
 */
exports.getRecruitListTitle = (user_type) => {
  return this.isCosplayer(user_type) ? "カメラマン一覧" : "募集一覧";
}

exports.getBackMypageBtn = () => {
  return {
    href: '/mypage',
    name: 'マイページに戻る'
  }
}

/**
 * 撮影種別の列挙を操作します。
 */
exports.enumShotType = () => {
  const enumObj = [
    {code: 1, type: "event", name: "イベント"},
    {code: 2, type: "portlait", name: "ポートレート"},
    {code: 3, type: "private", name: "個人撮影"},
    {code: 4, type: "studio", name: "スタジオ撮影"},
    {code: 99, type: "other", name: "その他"}
  ]
  return new enumObject(enumObj);
}

/**
 * お知らせ種別の列挙を操作します。
 */
exports.enumNoticeType = () => {
  const enumObj = [
    {code: 1, type: "info", name: "お知らせ"},
    {code: 2, type: "event", name: "イベント"},
    {code: 3, type: "worn", name: "注意勧告"}
  ]
  return new enumObject(enumObj);
}

/**
 * マッチング種別の列挙を操作します。
 */
exports.enumMatchingStatus = () => {
  const enumObj = [
    {code: 1, type: "request", name: "交渉中"},
    {code: 3, type: "matching", name: "成立済み"},
    {code: 5, type: "reject", name: "却下済み"}
  ]
  return new enumObject(enumObj);
}

/**
 * スケジュール種別の列挙を操作します。
 */
exports.enumScheduleType = () => {
  const enumObj = [
    {code: 1, type: "cos", name: "コスプレイヤー"},
    {code: 2, type: "cam", name: "カメラマン"}
  ]
  return new enumObject(enumObj);
}

/**
 * ユーザー種別の列挙を操作します。
 */
exports.enumUserType = () => {
  const enumObj = [
    {code: 1, type: "cos", name: "コスプレイヤー"},
    {code: 2, type: "cam", name: "カメラマン"}
  ]
  return new enumObject(enumObj);
}

class enumObject {
  constructor(enumObj){
    this.enumObj = enumObj;
  }
  getName(code){
    const o = this.enumObj.filter(v => v.code == code);
    return o[0] ? o[0].name : "";
  }
  getCode(nameOrType){
    const o = this.enumObj.filter(v => v.name == nameOrType || v.type == nameOrType);
    return o[0] ? o[0].code : "";
  }
  getType(code){
    const o = this.enumObj.filter(v => v.code == code);
    return o[0] ? o[0].type : "";
  }
  getEnum(){
    return this.enumObj;
  }
}


