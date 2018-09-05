module.exports = {

  matching_page: class {
    constructor({matching_item = [], matching_history_item = []} = {}){
      this.matching_list = matching_item;
      this.matching_history = matching_history_item;
    }
  },

  /**
	 * マッチング一覧中身
	 */
  matching_item: class {
    constructor({matching_id = "", icon_url = "", user_name = "", status_type = {id: "", name:""}, datetime_info = {/* dateHelper.dateToObject */}} = {}){
      this.matching_id = matching_id;
      this.icon_url = icon_url;
      this.user_name = user_name;
      this.status_type = status_type;
      this.datetime_info = datetime_info;
    }
  },

  /**
	 * マッチング履歴中身
	 */
  matching_history_item: class {
    constructor({matching_id = "", icon_url = "", date_info = "", user_name = ""}){
      this.matching_id = matching_id;
      this.icon_url = icon_url;
      this.date_info = date_info;
      this.user_name = user_name;
    }
  }
}
