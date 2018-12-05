'use strict';
module.exports = (sequelize, DataTypes) => {
  var AuthTwitter = sequelize.define('AuthTwitter', {
    token: DataTypes.STRING,
    token_secret: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    }
  });

  AuthTwitter.associate = function(models) {
    // associations can be defined here
  };
  AuthTwitter.removeAttribute('id');
  return AuthTwitter;
};
