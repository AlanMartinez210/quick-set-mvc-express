module.exports = {
	/**
	 * スケジュール一覧
	 */
	notice_list: class {
		constructor({
			notice_list_item = [],
			notice_list_pager = {} 
		}){
			
			this.notice_list_item = notice_list_item;
      this.notice_list_pager = notice_list_pager;
		}
	},

	notice_list_item: class {
		constructor({id = "", notice_date = {/* moment */}, type = "", title = "", content = ""}){
			// const notice_date = dateHelper.getDate();
			this.id = id;
			this.date_info = {
        key: notice_date.format("YYYYMMDD"),
        year: notice_date.year(),
        month: notice_date.trueMonth(),
        day: notice_date.date(),
        week: notice_date.format('ddd'),
      };
			this.type = type;
			this.title = title;
			this.content = content;
		}
	}
}