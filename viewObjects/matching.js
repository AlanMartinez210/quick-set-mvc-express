/**
 * マッチング一覧中身
 */
class matching_item{
  constructor({
    matching_id = "",
    icon_url = "",
    user_name = "",
    status_type = {id: "", name:""},
    datetime_info = {/* moment */}
  }){
    this.matching_id = matching_id;
    this.icon_url = icon_url;
    this.user_name = user_name;
    this.status_type = status_type;
    this.datetime_info = datetime_info;
  }
};
/**
 * マッチング履歴中身
 */
class matching_history_item{
  constructor({
    matching_id = "",
    icon_url = "",
    date_info = "",
    user_name = ""
  }){
    this.matching_id = matching_id;
    this.icon_url = icon_url;
    this.date_info = date_info;
    this.user_name = user_name;
  }
};

module.exports = {
  matching_page: class {
    constructor(user_id, matchingList, matchingHistoryList){
      this.matching_list = matchingList.map(matching=>{
        // 自分が送ったマッチングと受け取ったマッチングで表示する項目を分ける
        const user = user_id!=matching.get('user_id')?matching.get('user'):matching.get('to_user');
        return new matching_item({
          matching_id: matching.get('id'),
          icon_url: user.get('icon_url'),
          user_name: user.get('user_name'),
          status_type: matching.get('status'),
          datetime_info: matching.get('updatedAt'),
        });
      });
      this.matching_history = matchingHistoryList.map(matching=>{
        // 自分が送ったマッチングと受け取ったマッチングで表示する項目を分ける
        const user = user_id!=matching.get('user_id')?matching.get('user'):matching.get('to_user');
        return new matching_history_item({
          matching_id: matching.get('id'),
          icon_url: user.get('icon_url'),
          user_name: user.get('user_name'),
          date_info: matching.get('updatedAt'),
        });
      });
    }
  },
};
