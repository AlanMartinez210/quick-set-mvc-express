const matchingRepository = require('../repository/matchingRepository')();
const customMatchingRepository = require('../repository/CustomRepository/matchingRepository');
const sessionHelper = require('../common/helper/sessionHelper');

const errorHelper = require('../common/helper/errorHelper');
const dateHelper = require('../common/helper/dateHelper');
const messageHelper = require('../common/helper/messageHelper');

/**
 * マッチング一覧の取得
 *
 * @param {request}
 * @return {Promise}
 */
exports.getMatchingList = (req) => {
  const user_id = sessionHelper.getUserId(req);
  return customMatchingRepository.getMatchingList(user_id)
  .then(rows=>{
    rows.forEach(row=>{
      if(user_id == row.from_user_id){
        // 自分から依頼したデータ
        row.icon_url = row.to_user_icon_url;
        row.user_name = row.to_user_user_name;
        row.status_type = global.C2LINK.MATCHING_STATUS_ID_MAP.getSendMathingStatus(row.status_id);
        row.datetime_info = dateHelper.dateToObject(row.created_at);
      }else{
        // 自分に依頼されたデータ
        row.icon_url = row.from_user_icon_url;
        row.user_name = row.from_user_user_name;
        row.status_type = global.C2LINK.MATCHING_STATUS_ID_MAP.getSendMathingStatus(row.status_id);
        row.datetime_info = dateHelper.dateToObject(row.created_at);
      }
    });
    return rows;
  });
};

exports.getMatchingHistoryList = (req) => {
  const user_id = sessionHelper.getUserId(req);
  return customMatchingRepository.getMatchingHistoryList(user_id)
  .then(rows=>{
    rows.forEach(row=>{
      if(user_id == row.from_user_id){
        // 自分から依頼したデータ
        row.icon_url = row.to_user_icon_url;
        row.user_name = row.to_user_user_name;
        row.status_type = row.status_id;
        row.datetime_info = dateHelper.dateToObject(row.created_at);
      }else{
        // 自分に依頼されたデータ
        row.icon_url = row.from_user_icon_url;
        row.user_name = row.from_user_user_name;
        row.status_type = row.status_id;
        row.datetime_info = dateHelper.dateToObject(row.created_at);
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
 exports.postRequest = (req) => {
   const user_id = sessionHelper.getUserId(req);
   const schedule_id = req.form_data.schedule_id;
   const data = {
     schedule_id,
     user_id,
     status_id:global.C2LINK.MATCHING_STATUS_ID_MAP.REQUEST,
   };
   return matchingRepository.create(data)
          .then(row=>{
            console.log(row);
          })
          .catch(err=>{
            if(err.errors[0].path == 'matchings_user_id_schedule_id'){
              throw new errorHelper().setWindowMsg('L00002');
            }else{
              throw err;
            }
          })
 };
