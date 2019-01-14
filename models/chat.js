const dateHelper = require("../common/helper/dateHelper");

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Chat = sequelize.define('Chat', {
    matching_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    seq_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,   /** 内緒機能実装時に使う **/
    message: DataTypes.STRING,
    read_flag: DataTypes.BOOLEAN
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    }
  });
  Chat.associate = function(models) {
    // associations can be defined here
    // ユーザーとの結合
    this.belongsTo(models.User, {as: "user"})
  };

  /* == class method == */
  /**
   * メッセージルームのメッセージ一覧を取得
   *
   */
  Chat.getMessageList = function(matching_id, options={}){
    options.include = [ "user" ];
    options.where = {
      matching_id: parseInt(matching_id),
    };
    return this.findAll(options);
  }

  /**
   * チャットの発言
   *
   */
  Chat.postMessage = function(user_id, matching_id, message, options={}){
    const data = {matching_id, user_id, message};
    return this.create(data, options);
  }

  return Chat;
};
