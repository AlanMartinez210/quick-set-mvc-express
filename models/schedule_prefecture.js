'use strict';
module.exports = (sequelize, DataTypes) => {
  var s = require('../models/index');
  sequelize = sequelize||s.sequelize;
  DataTypes = DataTypes||s.Sequelize;
  var Schedule_prefecture = sequelize.define('Schedule_prefecture', {
    schedule_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    prefecture_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  }, {
    createdAt: false,
    updatedAt: false,
  });
  Schedule_prefecture.associate = function(models) {
    // associations can be defined here
  };
  return Schedule_prefecture;
};
