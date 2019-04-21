'use strict';
const dateHelper = require('../common/helper/dateHelper');

module.exports = (sequelize, DataTypes) => {
  const Content_chara = sequelize.define('Content_chara', {
    content_title_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    nickname: DataTypes.STRING,
    name_type: DataTypes.INTEGER,
    create_user_id: DataTypes.BIGINT
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    },
  });
  Content_chara.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.Content_title, {as: "content_title"})
  };

  /**
   * キャラクターを取得する
   * chara_id: キャラID
   * options: options
   */
  Content_chara.getCharaById = async function(chara_id, options={}){
    options.include = ["content_title"];
    return this.findByPk(chara_id, options);
  };

  /**
   * キャラクターが存在するか確認する。
   * chara_id: キャラID
   * options: options
   */
  Content_chara.isExist = async function(chara_id, options={}){
    return this.findByPk(chara_id, options)
    .then(instance => {
      return instance ? true : false;
    })
  };

  /**
   * キャラクターを登録する
   * user_id: 作成者ID
   * obj: パラメータ
   */
  Content_chara.addChara = async function({content_title_id, name, nickname, name_type, create_user_id} = data, options = {}){
    return this.create({
      content_title_id, 
      name,
      nickname,
      name_type,
      create_user_id
    }, options);
  };

  /**
   * キーワードからキャラクターを検索する。
   * 
   * 
   */
  Content_chara.search = async function(options = {}){
    options.include = ["content_title"];
    return this.findAll(options);
  }

  return Content_chara;
};
