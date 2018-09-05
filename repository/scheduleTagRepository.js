var abstractRepository = require('./abstractRepository');

const model = require('../models/schedule_tag');

var repo;
module.exports = () =>{
	// リポジトリは2回以上作成しない
	repo = repo || Object.assign(ScheduleTagRepository, abstractRepository(model));
	return repo;
}


const ScheduleTagRepository = {

	/**
	 * 指定したスケジュールIDに紐づくタグを取得します。
	 * 
	 * @param {*} schedule_id 
	 * @param {*} options 
	 */
	getScheduleTag(schedule_id, options = {}){
		options.where = {
			schedule_id: schedule_id
		}
		return repo.findAll(options);
	},

	/**
	 * スケジュールの都道府県を登録します。
	 *   - bulkcreateの為、配列で渡す
	 * 
	 * @param {Array} tag_arr 
	 * @param {*} options 
	 */
	createScheduleTag(tag_arr = [], options = {}){
		return repo.bulkCreate(tag_arr, options);
	},
	/**
	 * スケジュールに登録された都道府県を削除します。
	 * 
	 * @param {*} schedule_id 
	 * @param {*} options 
	 */
	deleteScheduleTag(schedule_id, options = {}){
		options.where = {
			schedule_id: schedule_id
		};
		return repo.destroy(options);
	}
}
