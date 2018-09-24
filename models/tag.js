'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tag = sequelize.define('Tag', {
    tag_name: DataTypes.STRING,
    use_count: DataTypes.INTEGER
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
  };
  return Tag;
};
