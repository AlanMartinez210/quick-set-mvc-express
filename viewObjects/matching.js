const pageHelper = require("../common/helper/pageHelper");

/**
 * マッチング一覧中身
 */
class matching_item{
  constructor(isMine, user, matching){
    this.isMine = isMine;

    this.matching_id = matching.get('id');
    this.schedule_id = matching.get('schedule_id');
    this.schedule_date_key = matching.get("schedule").get("date_key").format("L");
    this.schedule_event_name = matching.get("schedule").get("event_name");
    this.icon_url = user.get('icon_url');
    this.user_name = user.get('user_name');
    this.status_type = matching.get('status');
    this.datetime_info = matching.get('updatedAt').getDateTimeInfo();
  }
};

/**
 * マッチング履歴中身
 */
class matching_history_item{
  constructor(isMine, user, matching){
    this.isMine = isMine;

    this.matching_id = matching.get('id');
    this.icon_url = user.get('icon_url');
    this.date_info = matching.get('updatedAt').getDateInfo();
    this.user_name = user.get('user_name');
  }
};

module.exports = {

  matching_page: class {
    constructor(user_id, matchingList, matchingHistoryList, current_page = {page: 1}){
      
      this.matching_list = matchingList.rows.map(matching => {
      
        let isMine = false;
        let user = matching.get('user');

        // 自分とuser_idが同じだったら
        if(user_id == matching.get('user_id')){
          isMine = true;
          user = matching.get('to_user');
        }

        return new matching_item(isMine, user, matching);
      });

      this.matching_history = {
        rows: matchingHistoryList.rows.map(matching=>{

          let isMine = false;
          let user = matching.get('user');
  
          // 自分とuser_idが同じだったら
          if(user_id == matching.get('user_id')){
            isMine = true;
            user = matching.get('to_user');
          }
  
          return new matching_history_item(isMine, user, matching);
        }),
        pager: pageHelper.makePageObject(matchingHistoryList.count, current_page.page)
      }
    }
  },

  matching_history_list: class{
    constructor(user_id, matchingHistoryList, current_page = {page: 1}){
      this.matching_history = {
        rows: matchingHistoryList.rows.map(matching=>{

          let isMine = false;
          let user = matching.get('user');
  
          // 自分とuser_idが同じだったら
          if(user_id == matching.get('user_id')){
            isMine = true;
            user = matching.get('to_user');
          }
  
          return new matching_history_item(isMine, user, matching);
        }),
        pager: pageHelper.makePageObject(matchingHistoryList.count, current_page.page)
      }
    }
  }
};
