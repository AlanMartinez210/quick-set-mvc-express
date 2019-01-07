'use strict';
module.exports = (sequelize, DataTypes) => {
  const Content_title = sequelize.define('Content_title', {
    firstName: DataTypes.STRING
  }, {});
  Content_title.associate = function(models) {
    // associations can be defined here
  };
  return Content_title;
};