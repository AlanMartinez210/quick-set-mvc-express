'use strict';
const dateHelper = require('../common/helper/dateHelper');

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
  });
  Content_title.associate = function(models) {
    // associations can be defined here
    this.hasMany(models.Content_chara, {as: "content_chara", foreignKey: "content_title_id", targetKey: "id" });
  };

  /**
   * 作品を取得する
   * content_id: 作品ID
   * options: options
   */
  Content_title.getContentTitleById = async function(content_id, options={}){
    options.include = ["content_chara"];
    return this.findByPk(content_id, options);
  };

  Content_title.isExist = async function(content_id, options={}){
    return this.findByPk(content_id, options)
    .then(instance => {
      return instance ? true : false;
    })
  };

  /**
   * 作品を登録する
   * user_id: ユーザーID
   * obj: パラメータ
   * options: options
   */
  Content_title.addContentTitle = async function({name, sub_title, abbreviation, create_user_id} = data, options={}){
    return this.create({
      name, 
      sub_title, 
      abbreviation, 
      create_user_id
    }, options);
  };

  /**
   * 作品を検索する
   * obj: キーワード
   * options: options
   */
  Content_title.search = async function(options={}){
    options.include = ["content_chara"];
    return this.findAll(options);
  };

  return Content_title;
};
