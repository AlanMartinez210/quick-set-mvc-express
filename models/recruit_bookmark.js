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

  /**
   * ブックマークをつける
   */
  recruit_bookmark.createBookmark = function(user_id, schedule_id, options = {}){
    return this.create({
      user_id, schedule_id
    }, options);
  }
  /**
   * ブックマークを外す
   */
  recruit_bookmark.deleteBookmark = function(user_id, schedule_id, options = {}){
    return this.destroy({
      where: {user_id, schedule_id}
    }, options);
  }
  return recruit_bookmark;
};
