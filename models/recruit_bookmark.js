'use strict';
module.exports = (sequelize, DataTypes) => {
  var recruit_bookmark = sequelize.define('recruit_bookmarks', {
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    schedule_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
  }, {
    createdAt: false,
    updatedAt: false,
  });
  recruit_bookmark.associate = function(models) {
    // associations can be defined here
  };
  return recruit_bookmark;
};
