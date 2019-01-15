'use strict';
module.exports = (sequelize, DataTypes) => {
  const Content_chara = sequelize.define('Content_chara', {
    content_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    create_user_id: DataTypes.BIGINT
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    },
    timestamps: false
  });
  Content_chara.associate = function(models) {
    // associations can be defined here
  };
  return Content_chara;
};