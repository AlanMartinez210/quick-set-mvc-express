const customScheduleRepository = require("../repository/CustomRepository/scheduleRepository");
const pageHelper = require("../common/helper/pageHelper");
const dateHelper = require('../common/helper/dateHelper');

/**
 *  user_type: ユーザーのuser_type
 *  date_key: 検索条件のdate_key
 *  page: ページ番号 1-
 *
 */
exports.getScheduleList = async ({user_type, date_key, page})=>{
  const data = {
    schedule_type: user_type==1?2:1,
    date_key: date_key?date_key.toDate():undefined,
  };
  const options = {
    page: page,
  };
  const result = await Promise.all([
    customScheduleRepository.getScheduleListResult(data, options),
    customScheduleRepository.getScheduleListCount(data, options),
  ])
  .then(res => {
    // 日付をmomentに変換
    res[0].forEach((ele, idx) => {
      res[0][idx].date_key = dateHelper.getDate(ele.date_key);
    });
    return res;
  })

  const count = result[1][0].cnt;

  return {
    rows: result[0],
    pages: pageHelper.makePageObject(count, page),
  };
}
