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
   * 指定した機材情報を取得する。
   * 
   * @param {*} equipment_id
   * @param {*} options
   */
  Equipment.getEquipmentById = function(equipment_id, options = {}) {
    this.findByPk(equipment_id, options);
  }

  /**
   * 指定ユーザーの機材一覧を取得する。
   * 
   * @param {*} user_id
   * @param {*} options
   */
  Equipment.getEquipmentListByUserId = function(user_id, options = {}){
    options.where = {
      user_id: user_id,
    };
    return this.findAll(options);
  }

  /**
   * 新しく機材設定を追加する。
   *
   * @param {*} equipment_data
   * @param {*} options
   */
  Equipment.createEquipment = function(equipment_data, options = {}){
    return this.create(equipment_data, options)
  };

  return Equipment;
};