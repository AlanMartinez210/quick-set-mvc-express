'use strict';
module.exports = (sequelize, DataTypes) => {
  var Schedule = sequelize.define('Schedule', {
    user_id: DataTypes.INTEGER,
    schedule_type: DataTypes.INTEGER,
    group_year: DataTypes.INTEGER,
    group_month: DataTypes.INTEGER,
    date_key: DataTypes.DATE,
    time_from: DataTypes.STRING,
    time_to: DataTypes.STRING,
    shot_type: DataTypes.INTEGER,
    event_name: DataTypes.STRING,
    event_url: DataTypes.STRING,
    cost: DataTypes.STRING,
    num: DataTypes.STRING,
    cos_chara: DataTypes.INTEGER,
    remarks: DataTypes.STRING
  }, {});
  Schedule.associate = function(models) {
    // associations can be defined here
  };
  return Schedule;
};
