'use strict';
module.exports = (sequelize, DataTypes) => {
  const Content_chara = sequelize.define('Content_chara', {
    firstName: DataTypes.STRING
  }, {});
  Content_chara.associate = function(models) {
    // associations can be defined here
  };
  return Content_chara;
};