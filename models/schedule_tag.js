'use strict';
module.exports = (sequelize, DataTypes) => {
  var s = require('../models/index');
  sequelize = sequelize||s.sequelize;
  DataTypes = DataTypes||s.Sequelize;
  var Schedule_tag = sequelize.define('Schedule_tag', {
    schedule_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    tag_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    }
  }, {
    createdAt: false,
    updatedAt: false,
  });
  Schedule_tag.associate = function(models) {
    // associations can be defined here
  };
  return Schedule_tag;
};
