const db = require("../models/index");
const pageHelper = require("../common/helper/pageHelper");
const errorHelper = require("../common/helper/errorHelper");
const c2Util = require("../services/c2link4DiService");

/**
 *  user_type: ユーザーのuser_type
 *  date_key: 検索条件のdate_key
 *  page: ページ番号 1-
 *
 */
exports.getRecruitList = (user_id, search_param)=>{
  // schedule_typeを決定する
  if(c2Util.isCosplayer(search_param.user_type)){
    search_param.schedule_type = c2Util.enumScheduleType().getCode('cam');
  }
  else if(c2Util.isCameraman(search_param.user_type)){
    search_param.schedule_type = c2Util.enumScheduleType().getCode('cos');
  }
  return db.Schedule.getRecruitList(user_id, search_param);
}


/**
 * スケジュール詳細を取得
 * @param {integer} schedule_id
 */
exports.getScheduleDetail = (schedule_id)=>{
  return customScheduleRepository.getScheduleDetail({schedule_id});
}

/**
 * ブックマークの登録/削除
 *
 *  user_id: ユーザーのid
 *  schedule_id: 対象のschedule_id
 *  mode: 登録の場合:1, 削除の場合:0
 *
 */
exports.switchingBookmark = (user_id, schedule_id, mode)=>{
  switch(mode){
    case 1:
      return db.Recruit_bookmark.createBookmark(user_id, schedule_id)
      .catch(err=>{
        if(err.name == 'SequelizeUniqueConstraintError'){
          // ブックマーク済みの場合
          return Promise.reject(new errorHelper({code: "E00016"}))
        }
        return Promise.reject(new errorHelper({code: "E00016"}))
      });
    case 0:
      return db.Recruit_bookmark.deleteBookmark(user_id, schedule_id)
      .catch(()=>{
        return Promise.reject(new errorHelper({code: "E00000"}))
      });
  }
}
