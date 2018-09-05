'use strict';
module.exports = (sequelize, DataTypes) => {
  var s = require('../models/index');
  sequelize = sequelize||s.sequelize;
  DataTypes = DataTypes||s.Sequelize;

  var User = sequelize.define('User', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_key: DataTypes.STRING,
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    icon_url: DataTypes.STRING,
    user_type: DataTypes.INTEGER,
    tags: DataTypes.JSON,
    prefectures: DataTypes.JSON,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
