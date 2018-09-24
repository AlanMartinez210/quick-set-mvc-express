'use strict';
module.exports = (sequelize, DataTypes) => {
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
    expiration_date: DataTypes.DATE
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
