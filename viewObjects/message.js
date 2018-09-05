module.exports = {
	/**
	 * 新着メッセージ一覧
	 */
  newMessageList: class {
    constructor({send_date_info = {}, user_name = "", summary = ""}){
      this.send_date_info = send_date_info;
      this.user_name = user_name;
      this.summary = summary;
    }
  },
  
  /**
   * メッセージ履歴一覧
   */
  messageHistoryList: class {
    constructor({history_date_info = {}, user_name = ""}){
      this.history_date_info = history_date_info;
      this.user_name = user_name;
    }
  }
}