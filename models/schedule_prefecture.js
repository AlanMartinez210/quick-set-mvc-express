const prefectureHelper = require("../common/helper/prefectureHelper");

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Schedule_prefecture = sequelize.define('Schedule_prefecture', {
    schedule_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      unique: 'compositeIndex'
    },
    prefecture_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: 'compositeIndex'
    },
    prefecture_name: {
      type: DataTypes.VIRTUAL,
      get() {
        return prefectureHelper.getPrefectureNameById(this.getDataValue('prefecture_id'));
      }
    }
  }, {
    timestamps: false,
  });

  // Schedule_prefecture.associate = function(models) {};

  /**
	 * 指定したスケジュールIDに紐づく都道府県コードを取得します。
	 * 
	 * @param {*} schedule_id 
	 * @param {*} options 
	 */
	Schedule_prefecture.getSchedulePrefsCd = function(schedule_id, options = {}){
		options.where = { schedule_id: schedule_id }
		return this.findAll(options);
  };
  
  /**
	 * スケジュールの都道府県を登録します。
	 *   - bulkcreateの為、配列で渡す
	 * 
	 * @param {Array} pref_arr 
	 * @param {*} options 
	 */
	Schedule_prefecture.createSchedulePrefs = function(pref_arr = [], options = {}){
		return this.bulkCreate(pref_arr, options);
  };
  
  /**
	 * スケジュールに登録された都道府県を削除します。
	 * 
	 * @param {*} schedule_id 
	 * @param {*} options 
	 */
	Schedule_prefecture.deleteSchedulePref = function(schedule_id, options = {}){
		options.where = { schedule_id: schedule_id };
		return this.destroy(options);
	}
  
  return Schedule_prefecture;
};
