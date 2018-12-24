'use strict';
module.exports = (sequelize, DataTypes) => {
  var Recruit_bookmark = sequelize.define('Recruit_bookmark', {
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
  Recruit_bookmark.associate = function(models) {
    // associations can be defined here
  };

  /**
   * ブックマークをつける
   */
  Recruit_bookmark.createBookmark = function(user_id, schedule_id, options = {}){
    return this.create({
      user_id, schedule_id
    }, options);
  }

  /**
   * ブックマークを外す
   */
  Recruit_bookmark.deleteBookmark = function(user_id, schedule_id, options = {}){
    return this.destroy({
      where: {user_id, schedule_id}
    }, options);
  }
  
  return Recruit_bookmark;
};
