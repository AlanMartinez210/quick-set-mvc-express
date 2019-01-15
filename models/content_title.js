'use strict';
module.exports = (sequelize, DataTypes) => {
  const Content_title = sequelize.define('Content_title', {
    name: DataTypes.STRING,
    sub_title: DataTypes.STRING,
    abbreviation: DataTypes.STRING,
    create_user_id: DataTypes.BIGINT
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    },
    timestamps: false
  });
  Content_title.associate = function(models) {
    // associations can be defined here
  };
  return Content_title;
};