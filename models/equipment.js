'use strict';
module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define('Equipment', {
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
  return Equipment;
};