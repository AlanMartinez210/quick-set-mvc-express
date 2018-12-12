const dateHelper = require('../common/helper/dateHelper');

module.exports = {
	/**
	 * 画面初期表示
	 */
	initView: class {
		constructor(monthly_schedule_list = [], monthly_schedule_num = []){
			const current_date = dateHelper.getDate();

			this.calendar = monthly_schedule_list;
			this.select_year = current_date.year();
			this.select_month = current_date.trueMonth();
			this.current_year = current_date.year();
			this.today = current_date.format("L");
			this.month_schedule_num_arr = scheduleNumByNum(monthly_schedule_num);
		}
	},

	/**
	 * 月のスケジュール取得時
	 */
	getSelectScheduleList: class{
		constructor(monthly_schedule_list = {}, monthly_schedule_num = [], select_year, select_month){
			const current_date = dateHelper.getDate();

			this.calendar = monthly_schedule_list;
			this.select_year = select_year;
			this.select_month = select_month;
			this.current_year = current_date.year();
			this.today = current_date.format("L");
			this.month_schedule_num_arr = scheduleNumByNum(monthly_schedule_num);
		}
	},

	/**
	 * 選択したスケジュールの表示
	 */
	getScheduleInfo: class {
		constructor(scheduleInfo = {}){
			this.schedule_id = scheduleInfo.id;
			this.date_key = scheduleInfo.date_key.format("L");
			this.shot_type = scheduleInfo.shot_type.code;
			this.prefecture = scheduleInfo.Schedule_prefectures[0].prefecture_id;
			this.prefectures_field = scheduleInfo.Schedule_prefectures;
			this.tag_field = scheduleInfo.getArrTagByName;
			this.coschara = scheduleInfo.cos_chara;
			this.cost = Number(scheduleInfo.cost);
			this.num =  Number(scheduleInfo.num);
			this.time_from = scheduleInfo.time_from;
			this.time_to = scheduleInfo.time_to;
			this.event_name = scheduleInfo.event_name;
			this.event_url = scheduleInfo.event_url;
			this.remarks = scheduleInfo.remarks;
		}
	}
}

/**
 * 月ごとのスケジュール数を画面の形式に合わせる。
 * 
 * @param {*} month_schedule_num_arr 
 */
function scheduleNumByNum(month_schedule_num_arr){
	console.log('month_schedule_num_arr: ', month_schedule_num_arr);
	const arr = [0,0,0,0,0,0,0,0,0,0,0,0];
	month_schedule_num_arr.forEach(v => {
		arr[(v.group_month - 1)] = v.count;
	});
	console.log('arr: ', arr);
	return arr;
}