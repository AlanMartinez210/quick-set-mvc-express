const PAGE_COUNT = global.APPENV.PAGE_COUNT;
const enumMatchingStatus = require('../services/c2link4DiService').enumMatchingStatus();
const dateHelper = require('../common/helper/dateHelper');
const errorHelper = require("../common/helper/errorHelper");


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
    this.belongsTo(models.User, {as:"user", foreignKey: "review_from"});
    this.belongsTo(models.User, {as:"to_user", foreignKey: "review_to"});
    this.belongsTo(models.Matching, {as:"matching"});
  };

  /** option set **/
  const ModelOption = {
    revieweeHistoryList: (user_id, options={})=>{
      options.include = ["user", "matching"];
      options.where = {
        review_to: user_id,
      };
      return options;
    },
    reviewHistoryList: (user_id, options={})=>{
      options.include = ["to_user", "matching"];
      options.where = {
        review_from: user_id,
      };
      return options;
    },
  };

  /* == class method == */
  /**
   * 自分がされたレビューの一覧を取得
   */
  Review.getRevieweeHistoryList = function(user_id, page, options={}){
    options = ModelOption.revieweeHistoryList(user_id, options);
    options.limit = PAGE_COUNT;
    options.offset = PAGE_COUNT * (page-1);
    return this.findAndCountAll(options);
  };
  /**
   * 自分がしたレビューの一覧を取得
   */
  Review.getReviewHistoryList = function(user_id, page, options={}){
    options = ModelOption.reviewHistoryList(user_id, options);
    options.limit = PAGE_COUNT;
    options.offset = PAGE_COUNT * (page-1);
    return this.findAndCountAll(options);
  };

  Review.postReview = function(matching_id, review_from, review_type, review_comment){
    return this.create({
      matching_id, review_from, review_type, review_comment
    });
  }

  return Review;
};
