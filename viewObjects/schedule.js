const dateHelper = require('../common/helper/dateHelper');

module.exports = {
	/**
	 * スケジュール一覧
	 */
	scheduleMonthList: class {
		constructor({calendar = [], select_year = "", select_month = "", month_schedule_num_arr = []}){
			this.calendar = calendar;
			this.select_year = select_year;
			this.select_month = select_month;
			this.current_year = dateHelper.getCurrentYear();
			this.today = dateHelper.getToday();
			this.month_schedule_num_arr = month_schedule_num_arr;
		}
	},

	scheduleInfo: class {
		constructor({date_key = "", shot_type = 1, prefectures = [], tags = [], coschara = [],
		cost = 0, num = 0, start_time = "", end_time = "", event_name = "", event_url = "", remark = ""}){
			this.date_key = date_key;
			this.shot_type = shot_type;
			this.prefectures = prefectures;
			this.tags = tags;
			this.coschara = coschara;
			this.cost = Number(cost);
			this.num =  Number(num);
			this.start_time = start_time;
			this.end_time = end_time;
			this.event_name = event_name;
			this.event_url = event_url;
			this.remark = remark;
		}
	}
}