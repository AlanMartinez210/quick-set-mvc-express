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
    to_user_id: DataTypes.INTEGER,
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
  };
  return Chat;
};
