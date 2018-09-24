var abstractRepository = require('./abstractRepository');

var repo;
module.exports = () =>{
	// リポジトリは2回以上作成しない
	repo = repo || Object.assign(schedulePrefectureRepository, abstractRepository("Schedule_prefecture"))
	return repo;
}


const schedulePrefectureRepository = {

	/**
	 * 指定したスケジュールIDに紐づく都道府県コードを取得します。
	 * 
	 * @param {*} schedule_id 
	 * @param {*} options 
	 */
	getSchedulePrefsCd(schedule_id, options = {}){
		options.where = {
			schedule_id: schedule_id
		}
		return repo.findAll(options);
	},

	/**
	 * スケジュールの都道府県を登録します。
	 *   - bulkcreateの為、配列で渡す
	 * 
	 * @param {Array} pref_arr 
	 * @param {*} options 
	 */
	createSchedulePrefs(pref_arr = [], options = {}){
		return repo.bulkCreate(pref_arr, options);
	},

	/**
	 * スケジュールに登録された都道府県を削除します。
	 * 
	 * @param {*} schedule_id 
	 * @param {*} options 
	 */
	deleteSchedulePref(schedule_id, options = {}){
		options.where = {
			schedule_id: schedule_id
		};
		return repo.destroy(options);
	}
}
