'use strict';
module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define('Equipment', {
    id:{
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: DataTypes.BIGINT.UNSIGNED,
    equipment_type: DataTypes.TINYINT.UNSIGNED,
    maker_type: DataTypes.TINYINT.UNSIGNED,
    maker_name: DataTypes.STRING,
    equipment_name: DataTypes.STRING,
    use_year: DataTypes.TINYINT.UNSIGNED,
  }, {});
  Equipment.associate = function(models) {
    // associations can be defined here
  };

  /**
   * 新しく機材設定を追加する。
   *
   * @param {*} user_data
   * @param {*} options
   */
  Equipment.update = function(equipment_data, options = {}){
    return this.create(equipment_data, options)
  };

  return Equipment;
};