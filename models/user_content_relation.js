'use strict';
const dateHelper = require('../common/helper/dateHelper');

module.exports = (sequelize, DataTypes) => {
  const User_content_relation = sequelize.define('User_content_relation', {
    user_id: DataTypes.BIGINT,
    content_id: DataTypes.BIGINT,
    chara_id: DataTypes.BIGINT,
    remarks: DataTypes.STRING,
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    },
  });
  User_content_relation.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.Content_chara, {as:"chara"})
    this.belongsTo(models.Content_title, {as:"content"})
  };

  /**
   * ユーザーが作成した衣装一覧を取得する
   */
  User_content_relation.getUserCostumeList = async function(user_id, options = {}){
    options.include = [ "content", "chara"];
    options.where = {user_id: user_id};
    return this.findAll(options);
  };

  /**
   * 衣装を登録する
   */
  User_content_relation.addCostume = async function(user_id, {content_id, chara_id, remarks}, options = {}){
    return this.create({
      user_id: user_id,
      content_id, chara_id, remarks,
    },options);
  };

  /**
   * 衣装を登録する
   */
  User_content_relation.updateCostume = async function(user_id, {costume_id, remarks}, options = {}){
    options.where = {
      id: costume_id,
      user_id: user_id,
    };
    return this.update({
      remarks,
    },options);
  };

  /**
   * 衣装を登録する
   */
  User_content_relation.updateCostume = async function(user_id, {costume_id, remarks}, options = {}){
    options.where = {
      id: costume_id,
      user_id: user_id,
    };
    return this.update({
      remarks,
    },options);
  };

  /**
   * 衣装を削除する
   */
  User_content_relation.deleteCostume = async function(user_id, {costume_id}, options = {}){
    options
    return this.destroy({
      where: {user_id, id: costume_id},
    }, options);
  };

  /**
   * ユーザーIDから衣装を取得する
   */
  User_content_relation.getCostumeByUserID = async function(user_id, options = {}){
    options.include = [ "content", "chara"];
    options.where = { user_id: user_id };
    return this.findAll(options);
  };

  /**
   * コスチュームIDから衣装を取得する
   */
  User_content_relation.getCostumeByID = async function(costume_id, options = {}){
    options.include = [ "content", "chara"];
    return this.findByPk(costume_id, options);
  };

  return User_content_relation;
};
