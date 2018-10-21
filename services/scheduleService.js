const dateHelper = require('../common/helper/dateHelper');
const errorHelper = require('../common/helper/errorHelper');
const prefectureHelper = require("../common/helper/prefectureHelper");
const calendarHelper = require("../common/helper/calendarHelper");

const c2Util = require("../services/c2link4DiService");

const scheduleRepository = require("../repository/scheduleRepository")();
const scheduleTagRepository = require("../repository/scheduleTagRepository")();
const schedulePrefectureRepository = require("../repository/schedulePrefectureRepository")();
const tagRepository = require('../repository/tagRepository')();

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
  const schedule_list = await scheduleRepository.getScheduleList(user_id, year, month)
  const current_calendar = calendarHelper.getCalendar(year, month);
  console.log("getScheduleList", schedule_list);
  return c2Util.bindSchedule(current_calendar, schedule_list);
}

/**
 * 指定した年の対象ユーザーの月別のスケジュール投稿数を取得します
 *
 * @param {string} user_id 対象ユーザー
 * @param {number} year 年 YYYY
 *
 * @returns {Array}
 *
 */
exports.getMonthScheduleNumList = async (user_id, year) => {
  const scheduleNumList = [0,0,0,0,0,0,0,0,0,0,0,0];
  const rows = await scheduleRepository.getMonthScheduleNumList(user_id, year);
  rows.forEach(val => {
    scheduleNumList[val.group_month-1] = val.count
  })
  return scheduleNumList;
}

/**
 * 対象ユーザーの指定した日付のスケジュール情報を取得します。
 *
 * @param {*} user_id
 * @param {*} date_key
 */
exports.getScheduleData = async (schedule_id) => {
  try{
    // スケジュール情報の情報を取得
    const schedule = await scheduleRepository.getScheduleById(schedule_id);

    // スケジュール情報に紐づいたタグ、都道府県の取得
    const [scheduleTag, schedulePref] = await Promise.all([
      scheduleTagRepository.getScheduleTag(schedule.id),
      schedulePrefectureRepository.getSchedulePrefsCd(schedule.id)
    ]);
  
    // タグと都道府県情報の取得
    schedule.tags = scheduleTag.map(obj => obj.tag_id);
    schedule.prefectures = schedulePref.map(obj => obj.prefecture_id);
    
    // タグIDを名称に変換
    const tagData = await tagRepository.getTagById(schedule.tags);
    schedule.tags = tagData.map(obj => obj.tag_name);
    schedule.prefectures = prefectureHelper.getPrefectureNameByIds(schedule.prefectures);

    return schedule;
  }
  catch(err){
    return err;
  }
}

/**
 * スケジュールデータの登録を行う。
 *
 * @param {*} registData
 */
exports.upsertScheduleData = (registData) => {
  // 登録データをDate型に変換する。
  registData.date_key = registData.date_key.toDate();
  // 
  registData.prefectures = prefectureHelper.getPrefectureIdByName(registData.prefectures);
  // スケジュールIDの設定
  let schedule_id = registData.schedule_id;
  try{
    return scheduleRepository.Sequelize.transaction(
      async(tx) => {
        // タグの登録/更新
        const tagsResult = await function(){

          if(registData.tags.length <= 0) return;
          const upsertPromise = [];
          registData.tags.forEach(val => {
            upsertPromise.push(tagRepository.upsertTag(val, {transaction: tx}));
          })
          return Promise.all(upsertPromise);
        }();
        
        // スケジュール情報のタグ部分を登録したタグIDに置き換える
        await function(){
          if(!tagsResult) return;
          const tag_id_arr = [];
          tagsResult.forEach(obj => {
            tag_id_arr.push(obj.tag_id);
          });
          registData.tags = tag_id_arr;
        }();

        
        if(schedule_id){
          // 更新
          await scheduleRepository.updateSchedule(schedule_id, registData, {transaction: tx})
        }
        else{
          // 登録
          await scheduleRepository.createSchedule(registData, {transaction: tx})
          .then(res => {
            schedule_id = res.id;
          })
        }

        // スケジュールの取得
        const scheduleResult = await scheduleRepository.getScheduleById(schedule_id, {transaction: tx});

        console.log(scheduleResult);

        // 登録したスケジュールに属するタグと都道府県情報を削除
        await Promise.all([
          schedulePrefectureRepository.deleteSchedulePref(scheduleResult.id, {transaction: tx}),
          scheduleTagRepository.deleteScheduleTag(scheduleResult.id, {transaction: tx})
        ])

        // 都道府県とタグ情報の形式を整える
        const prefAndTagObject = await function(){
          const prefs = registData.prefectures.map(v => {
            return {schedule_id: scheduleResult.id, prefecture_id: v};
          });
          const tags = registData.tags.map(v => {
            return {schedule_id: scheduleResult.id, tag_id: v};
          });
          return {prefs, tags};
        }();

        // タグの登録
        await function(){
          return Promise.all([
            schedulePrefectureRepository.createSchedulePrefs(prefAndTagObject.prefs, {transaction: tx}),
            scheduleTagRepository.createScheduleTag(prefAndTagObject.tags, {transaction: tx})
          ])
        }();

      }
    )
  }
  catch(err){
    return err;
  }
}

/**
 * 対象ユーザーの指定日付のスケジュールと関連データを削除します。
 *
 * @param {*} user_id
 * @param {*} date_key
 */
exports.deleteScheduleData = (schedule_id) => {
  try{
    return scheduleRepository.Sequelize.transaction(
      async (tx) => {
        // スケジュール情報の取得
        const schedule = await scheduleRepository.getScheduleById(schedule_id, {transaction: tx});

        // if(!schedule) return Promise.reject(new errorHelper().setWindowMsg("E00001"));

        // 取得したスケジュール情報のIDを元に関連データを削除
        await Promise.all([
          scheduleRepository.deleteSchedule(schedule.id, { transaction: tx }),
          schedulePrefectureRepository.destroy({
            where: { schedule_id: schedule.id },
            transaction: tx
          }),
          scheduleTagRepository.destroy({
            where: { schedule_id: schedule.id },
            transaction: tx
          })
        ])

      }
    )
  }
  catch(err){
    return err;
  }
}
