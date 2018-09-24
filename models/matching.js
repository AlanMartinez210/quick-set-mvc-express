'use strict';
module.exports = (sequelize, DataTypes) => {
  var Matching = sequelize.define('Matching', {
    schedule_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER,
    last_message: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {});
  Matching.associate = function(models) {
    // associations can be defined here
  };
  return Matching;
};
