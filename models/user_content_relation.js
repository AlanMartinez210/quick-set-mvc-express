'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_content_relation = sequelize.define('User_content_relation', {
    user_id: DataTypes.BIGINT,
    content_id: DataTypes.BIGINT,
    chara_id: DataTypes.BIGINT,
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    },
    timestamps: false
  });
  User_content_relation.associate = function(models) {
    // associations can be defined here
  };
  return User_content_relation;
};