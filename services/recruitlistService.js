const Schedule = require("../models/index").Schedule;
const pageHelper = require("../common/helper/pageHelper");

/**
 *  user_type: ユーザーのuser_type
 *  date_key: 検索条件のdate_key
 *  page: ページ番号 1-
 *
 */
exports.getRecruitList = async (search_param)=>{
  return Schedule.getRecruitList(search_param);
  const data = {
    schedule_type: user_type==1?2:1,
    date_key: date_key,
    search_param: search_param,
  };
  const options = {
    page: page,
  };
}


/**
 * スケジュール詳細を取得
 * @param {integer} schedule_id
 */
exports.getScheduleDetail = (schedule_id)=>{
  return customScheduleRepository.getScheduleDetail({schedule_id});
}
