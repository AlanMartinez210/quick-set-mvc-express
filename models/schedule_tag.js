'use strict';
module.exports = (sequelize, DataTypes) => {
  var Schedule_tag = sequelize.define('Schedule_tag', {
    schedule_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      unique: 'compositeIndex'
    },
    tag_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      unique: 'compositeIndex'
    }
  }, {
    timestamps: false,
  });
  Schedule_tag.associate = function(models) {
    // タグテーブルとの結合
    this.belongsTo(models.Tag, { foreignKey: "tag_id", targetKey: "id" })
    models.Tag.hasMany(this, { foreignKey: "tag_id", targetKey: "id" })
  };

  /* == class method == */

  /**
	 * 指定したスケジュールIDに紐づくタグを取得します。
	 * 
	 * @param {*} schedule_id 
	 * @param {*} options 
	 */
  Schedule_tag.getScheduleTags = function(schedule_id, options = {}){
    options.where = {
			schedule_id: schedule_id
    };
    options.include = ['Tag'];
		return this.findAll(options);
  }

  /**
	 * スケジュールの都道府県を登録します。
	 *   - bulkcreateの為、配列で渡す
	 * 
	 * @param {Array} tag_arr {schedule_id, tag_id}
	 * @param {*} options 
	 */
	Schedule_tag.createScheduleTag = function(tag_arr = [], options = {}){
		return this.bulkCreate(tag_arr, options);
  }
  
  /**
	 * スケジュールに登録された都道府県を削除します。
	 * 
	 * @param {*} schedule_id 
	 * @param {*} options 
	 */
  Schedule_tag.deleteScheduleTag =function(schedule_id, options = {}){
    options.where = {
			schedule_id: schedule_id
		};
		return this.destroy(options);
  }

  /* == instance method == */
  

  return Schedule_tag;
};
