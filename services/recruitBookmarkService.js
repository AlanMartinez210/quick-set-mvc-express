const db = require("../models/index");

/**
 * ブックマークの登録/削除
 *
 *  user_id: ユーザーのid
 *  schedule_id: 対象のschedule_id
 *  mode: 登録の場合:1, 削除の場合2
 *
 */
exports.process = (user_id, schedule_id, mode)=>{
  switch(mode){
    case 1:
      return db.recruit_bookmark.createBookmark(user_id, schedule_id);
    case 2:
      return db.recruit_bookmark.deleteBookmark(user_id, schedule_id);
  }
}
