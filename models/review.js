'use strict';
module.exports = (sequelize, DataTypes) => {
  var Review = sequelize.define('Review', {
    matching_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    review_from: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    review_to: DataTypes.INTEGER,
    review_type: DataTypes.INTEGER,
    review_comment: DataTypes.STRING
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    }
  });
  Review.associate = function(models) {
    // associations can be defined here
  };
  return Review;
};
