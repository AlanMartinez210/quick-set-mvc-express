'use strict';
module.exports = (sequelize, DataTypes) => {
  var s = require('../models/index');
  sequelize = sequelize||s.sequelize;
  DataTypes = DataTypes||s.Sequelize;
  var Matching = sequelize.define('Matching', {
    schedule_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER,
    last_message: DataTypes.STRING
  }, {});
  Matching.associate = function(models) {
    // associations can be defined here
  };
  return Matching;
};
