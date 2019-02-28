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
			this.tag_field = scheduleInfo.getArrTagByName;
			this.time_from = scheduleInfo.time_from;
			this.time_to = scheduleInfo.time_to;
			this.event_name = scheduleInfo.event_name;
			this.event_url = scheduleInfo.event_url;
			this.remarks = scheduleInfo.remarks;
			this.allow_recruit_flg = scheduleInfo.allow_recruit_flg;
			
			// コスプレイヤー
			if(scheduleInfo.schedule_type === 1){
				this.data_pass_type = scheduleInfo.data_pass_type.code;
				this.prefecture = scheduleInfo.Schedule_prefectures[0].prefecture_id;
				this.costume_field = scheduleInfo.cos_chara.map(v => {
					return {
						costume_id: v.get("id"),
						title: v.get("content").get("name"),
						chara: v.get("chara").get("name"),
					}
				});

				this.cost = scheduleInfo.cost;
				this.num =  scheduleInfo.num;
				this.self_payment_flg = scheduleInfo.self_payment_flg;
				this.allow_notice_flg = scheduleInfo.allow_notice_flg;
			}
			else{
				this.prefectures_field = scheduleInfo.Schedule_prefectures;
			}
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