'use strict';
module.exports = (sequelize, DataTypes) => {
  var s = require('../models/index');
  sequelize = sequelize||s.sequelize;
  DataTypes = DataTypes||s.Sequelize;
  var Chat = sequelize.define('Chat', {
    matching_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    seq_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {});
  Chat.associate = function(models) {
    // associations can be defined here
  };
  return Chat;
};
