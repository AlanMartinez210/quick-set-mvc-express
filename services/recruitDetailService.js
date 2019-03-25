const db = require("../models/index");
const errorHelper = require("../common/helper/errorHelper");
const c2Util = require("../services/c2link4DiService");

/**
 *  user_type: ユーザーのuser_type
 *  date_key: 検索条件のdate_key
 *  page: ページ番号 1-
 *
 */
exports.getRecruitDetail  = async (schedule_id) => {
  
  // スケジュールデータの取得
	const schedule = await db.Schedule.getSchedule(schedule_id, {
    include: [{ all: true, nested: true}]
  });

	// スケジュールデータがなければエラーにする。
	if(!schedule) return Promise.reject(new errorHelper({code: "fatal"}));
  // スケジュールに属するレビューデータの取得
  console.log(schedule.get("user_id"));
  const reviewData = await db.Review.getRevieweeHistoryList(schedule.get("user_id"), {limit: 5});

  return [schedule, reviewData];
}