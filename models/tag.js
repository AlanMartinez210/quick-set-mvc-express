'use strict';
module.exports = (sequelize, DataTypes) => {
  var s = require('../models/index');
  sequelize = sequelize||s.sequelize;
  DataTypes = DataTypes||s.Sequelize;
  var Tag = sequelize.define('Tag', {
    tag_name: DataTypes.STRING,
    use_count: DataTypes.INTEGER
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
  };
  return Tag;
};
