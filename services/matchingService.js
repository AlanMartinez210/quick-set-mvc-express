const matchingRepository = require('../repository/matchingRepository')();
const customMatchingRepository = require('../repository/CustomRepository/matchingRepository');
const dateHelper = require("../common/helper/dateHelper");

const errorHelper = require('../common/helper/errorHelper');
const c2link4DiService = require('./c2link4DiService');
const enumMatchingStatus = c2link4DiService.enumMatchingStatus();

/**
 * マッチング一覧の取得
 *
 * @param {request}
 * @return {Promise}
 */
exports.getMatchingList = (user_id) => {
  return customMatchingRepository.getMatchingList({user_id})
  .then(rows=>{
    rows.forEach(row=>{
      if(user_id == row.from_user_id){
        // 自分から依頼したデータ
        row.icon_url      = row.to_user_icon_url;
        row.user_name     = row.to_user_user_name;
        row.status_type   = row.status_id;
        row.datetime_info = row.created_at;
      }else{
        // 自分に依頼されたデータ
        row.icon_url      = row.from_user_icon_url;
        row.user_name     = row.from_user_user_name;
        row.status_type   = row.status_id;
        row.datetime_info = row.created_at;
      }
    });
    return rows;
  });
};

/**
 * マッチング履歴一覧の取得
 *
 * @param {request}
 * @return {Promise}
 */
exports.getMatchingHistoryList = (user_id) => {
  return customMatchingRepository.getMatchingHistoryList({user_id})
  .then(rows=>{
    rows.forEach(row=>{
      if(user_id == row.from_user_id){
        // 自分から依頼したデータ
        row.icon_url = row.to_user_icon_url;
        row.user_name = row.to_user_user_name;
        row.status_type = row.status_id;
        row.datetime_info = row.created_at;
      }else{
        // 自分に依頼されたデータ
        row.icon_url = row.from_user_icon_url;
        row.user_name = row.from_user_user_name;
        row.status_type = row.status_id;
        row.datetime_info = row.created_at;
      }
    });
    return rows;
  });

  ;
};


/**
 * 依頼する
 *
 * @param {request}  requestForm
 * @return {Promise}
 */
exports.postRequest = (user_id, schedule_id) => {
  return matchingRepository.create({
    schedule_id,user_id,
    status_id: enumMatchingStatus.getCode("request"),
  })
  .catch(err=>{
    if(err.errors[0].path == 'matchings_user_id_schedule_id'){
      throw new errorHelper().setWindowMsg("L00002");
    }else{
      throw err;
    }
  });
 };


/**
 * 依頼を承諾する
 *
 * @param user_id
 * @param matching_id
 */
exports.postConsent = async (user_id, matching_id) => {
  // 承諾対象のmatchingを取得
  const matching = await matchingRepository.findOne({
    where:{
      to_user_id: user_id,  /* 自分に依頼されてる */
      status_id: enumMatchingStatus.getCode("request"),  /* ステータスが申請中 */
      id: matching_id,
    }
  });
  if(!matching) throw new errorHelper().setWindowMsg("L00003");

  await matchingRepository.update({
    status_id: enumMatchingStatus.getCode("matching"),
  },{
    where:{
      id: matching_id,
    }
  });
  return true;
};

/**
 * 依頼を拒否する
 *
 * @param user_id
 * @param matching_id
 */
exports.postReject = async (user_id, matching_id) => {
  // 拒否対象のmatchingを取得
  const matching = await matchingRepository.findOne({
    where:{
      to_user_id: user_id,  /* 自分に依頼されてる */
      status_id: enumMatchingStatus.getCode("request"),  /* ステータスが申請中 */
      id: matching_id,
    }
  });
  if(!matching) throw new errorHelper().setWindowMsg("L00005");

  await matchingRepository.update({
    status_id: enumMatchingStatus.getCode("reject"),
  },{
    where:{
      id: matching_id,
    }
  });
  return true;
};
