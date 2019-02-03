const db = require("../models/index");
const enumMatchingStatus = require('../services/c2link4DiService').enumMatchingStatus();
const errorHelper = require("../common/helper/errorHelper");

/**
 * マッチング一覧の取得
 *
 * @param user_id
 * @return {Promise}
 */
exports.getMatchingList = (user_id) => {
  return db.Matching.getMatchingList(user_id);
};

/**
 * マッチング履歴一覧の取得
 *
 * @param user_id
 * @return {Promise}
 */
 exports.getMatchingHistoryList = (user_id, page=1) => {
  return db.Matching.getMatchingHistoryList(user_id, page);
};


/**
 * 依頼する
 *
 * @param user_id
 * @param schedule_id
 * @return {Promise}
 */
exports.postRequest = (user_id, schedule_id) => {
  return db.Matching.postRequest(user_id, schedule_id)
  .catch(err=>{
    if(err.errors[0].path == 'matchings_user_id_schedule_id'){
      throw new errorHelper({code: "L00002"});
    }
    throw err;
  });
};


/**
 * 依頼を承諾する
 *
 * @param user_id
 * @param matching_id
 */
exports.postConsent = async (user_id, matching_id) => {
  const canConsent = await db.Matching.canPostConsent(user_id, matching_id);
  if(!canConsent){
    throw new errorHelper({code: "L00003"});
  }
  await db.Matching.updateMatchingStatus(
    matching_id,
    enumMatchingStatus.getCode("matching")
  );
  return true;
};

/**
 * 依頼を拒否する
 *
 * @param user_id
 * @param matching_id
 */
exports.postReject = async (user_id, matching_id) => {
  const canReject = await db.Matching.canPostReject(user_id, matching_id);
  if(!canReject){
    throw new errorHelper({code: "L00005"});
  }
  await db.Matching.updateMatchingStatus(
    matching_id,
    enumMatchingStatus.getCode("reject")
  );
  return true;
};
