'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notice = sequelize.define('Notice', {
    notice_date: DataTypes.DATE,
    type: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    islogin: DataTypes.INTEGER,
  }, {});
  Notice.associate = function(models) {
    // associations can be defined here
  };
  return Notice;
};
