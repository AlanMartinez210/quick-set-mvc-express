'use strict';

module.exports = (sequelize, DataTypes) => {
  var s = require('../models/index');
  sequelize = sequelize||s.sequelize;
  DataTypes = DataTypes||s.Sequelize;

  var Schedule = sequelize.define('Schedule', {
    user_id: DataTypes.INTEGER,
    schedule_type: DataTypes.INTEGER,
    date_key: DataTypes.STRING,
    seq_id: DataTypes.INTEGER,
    time_from: DataTypes.STRING,
    time_to: DataTypes.STRING,
    shot_type: DataTypes.INTEGER,
    event_name: DataTypes.STRING,
    event_url: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    num: DataTypes.INTEGER,
    cos_chara: DataTypes.STRING,
    remarks: DataTypes.STRING
  }, {});
  Schedule.associate = function(models) {
    // associations can be defined here
  };
  return Schedule;
};
