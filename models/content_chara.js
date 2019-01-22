'use strict';
const dateHelper = require('../common/helper/dateHelper');

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
  });
  Content_chara.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.Content_title, {as:"content"})
  };
  /**
   * キャラクターを取得する
   * chara_id: キャラID
   * options: options
   */
  Content_chara.getChara = async function(chara_id, options={}){
    return this.findByPk(chara_id, options);
  };

  /**
   * キャラクターを登録する
   * user_id: 作成者ID
   * obj: パラメータ
   */
  Content_chara.addChara = async function(user_id, {content_id, name}){
    return this.create({
      create_user_id: user_id,
      content_id, name,
    });
  };

  return Content_chara;
};
