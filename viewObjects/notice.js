const c2link4DiService = require("../services/c2link4DiService");
const _ = require('lodash');

module.exports = {
	/**
	 * スケジュール一覧
	 */
	notice_obj: class {
		constructor({
			notice_list = [],
			notice_list_pager = {} 
		}){
			// 配列を必ず返す。
			this.notice_list = notice_list;
      this.notice_list_pager = notice_list_pager;
		}
	},

	notice_list_item: class {
		constructor(notice_list_item = {}){

			const enumType = c2link4DiService.enumNoticeType();
			const type = notice_list_item.get("type");

			this.id = notice_list_item.get("id");

			const d = notice_list_item.get("notice_date");
			this.date_info = {
        key: d.format("L"),
        year: d.year(),
        month: d.trueMonth(),
        day: d.date(),
        week: d.format('ddd'),
			};
			this.type = [enumType.getType(type), enumType.getName(type)];
			this.title = notice_list_item.get("title");
			this.content = notice_list_item.get("content");
		}
	}
}
