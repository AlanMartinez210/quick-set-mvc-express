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
  }, {});
  Review.associate = function(models) {
    // associations can be defined here
  };
  return Review;
};
