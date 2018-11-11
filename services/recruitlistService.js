const customScheduleRepository = require("../repository/CustomRepository/scheduleRepository");
const pageHelper = require("../common/helper/pageHelper");

/**
 *  user_type: ユーザーのuser_type
 *  date_key: 検索条件のdate_key
 *  page: ページ番号 1-
 *
 */
exports.getScheduleList = async ({date_key, user_type, search_param={}, page=1})=>{
  const data = {
    schedule_type: user_type==1?2:1,
    date_key: date_key,
    search_param: search_param,
  };
  const options = {
    page: page,
  };
  const result = await Promise.all([
    customScheduleRepository.getScheduleListResult(data, options),
    customScheduleRepository.getScheduleListCount(data, options),
  ]);

  const count = result[1][0].cnt;

  return {
    rows: result[0],
    pages: pageHelper.makePageObject(count, page),
  };
}
