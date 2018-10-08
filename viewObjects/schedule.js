const dateHelper = require('../common/helper/dateHelper');

module.exports = {
	/**
	 * スケジュール一覧
	 */
	scheduleMonthList: class {
		constructor({schedule_id = "", calendar = [], select_year = "", select_month = "", month_schedule_num_arr = []}){
			const current_date = dateHelper.getDate();
			this.calendar = calendar;
			this.select_year = select_year;
			this.select_month = select_month;
			this.current_year = current_date.year();
			this.today = current_date.toDate();
			this.month_schedule_num_arr = month_schedule_num_arr;
		}
	},

	scheduleInfo: class {
		constructor({date_key = "", shot_type = 1, prefectures = [], tags = [], coschara = [],
		cost = 0, num = 0, start_time = "", end_time = "", event_name = "", event_url = "", remark = ""}){
			this.date_key = dateHelper.getDate(date_key).format("YYYY/MM/DD");
			this.shot_type = shot_type;
			this.prefectures = prefectures;
			this.tags = tags;
			this.coschara = coschara;
			this.cost = Number(cost);
			this.num =  Number(num);
			this.time_from = start_time;
			this.time_to = end_time;
			this.event_name = event_name;
			this.event_url = event_url;
			this.remarks = remark;
		}
	}
}