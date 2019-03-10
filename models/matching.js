'use strict';
const enumMatchingStatus = require('../services/c2link4DiService').enumMatchingStatus();
const dateHelper = require('../common/helper/dateHelper');

const PAGE_COUNT = global.APPENV.PAGE_COUNT;

module.exports = (sequelize, DataTypes) => {
  var Matching = sequelize.define('Matching', {
    schedule_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER,
    last_message: DataTypes.STRING
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) },
      status(){
        const status_id = this.getDataValue('status_id');
        return enumMatchingStatus.getObj(status_id);
      },
    }
  });
  Matching.associate = function(models) {
    // レビューとの結合
    models.Review.belongsTo(this, { foreignKey: "matching_id", targetKey: "id" })
    this.hasMany(models.Review, { foreignKey: "matching_id", targetKey: "id" })

    this.belongsTo(models.User, {as:"user"})
    this.belongsTo(models.User, {as:"to_user"})
    this.belongsTo(models.Schedule, {as:"schedule"})
  };

  /** option set **/
  const ModelOption = {
    belongsList: (user_id, options={})=>{
      options.include = ["user", "to_user"];
      options.where = {
        [sequelize.Op.or]: [{user_id: user_id}, {to_user_id: user_id}],
      };
      return options;
    },
    noReviewList: (user_id, options={})=>{
      options.include = ["user", "to_user", "schedule"];
      options.where = {
        [sequelize.Op.or]: [{user_id: user_id}, {to_user_id: user_id}],
        [sequelize.Op.and]: sequelize.literal('NOT EXISTS(select * from reviews where reviews.matching_id = Matching.id)'),
      };
      return options;
    },
    pendingList: (user_id, options={})=>{
      options.where = {
        to_user_id: user_id,
        status_id: enumMatchingStatus.getCode("request")
      };
      return options;
    },
    matchingList: (user_id, options={})=>{
      options.include = ["user", "to_user", "schedule"];
      options.where = {
        [sequelize.Op.or]: [{user_id: user_id}, {to_user_id: user_id}],
        status_id: [
          enumMatchingStatus.getCode("request"),
          enumMatchingStatus.getCode("matching"),
        ],
      };
      return options;
    },
    matchingHistoryList: (user_id, options={})=>{
      options.include = ["user", "to_user", "schedule"];
      options.where = {
        [sequelize.Op.and]:[
          {
            [sequelize.Op.or]: [{user_id: user_id},{to_user_id: user_id}],
          },
          {
            [sequelize.Op.or]: [
              {
                "$schedule.date_key$":{
                  [sequelize.Op.lt]:dateHelper.getDate().toDate(),
                }
              },
              {status_id: enumMatchingStatus.getCode("reject")}
            ],
          },
        ],
      };
      return options;
    },

  };

  /* == class method == */
  /**
   * 未レビューの数を取得する
   */
  Matching.getNoReviewNum = function(user_id, options={}){
    options = ModelOption.noReviewList(user_id, options);
    return this.count(options);
  };
  /**
   * 未レビューの一覧を取得する
   */
  Matching.getNoReviewList = function(user_id, page, options={}){
    options = ModelOption.noReviewList(user_id, options);
    options.limit = PAGE_COUNT;
    options.offset = PAGE_COUNT * (page-1);
    return this.findAndCountAll(options);
  };

  /**
   * 保留中の依頼の数を取得する
   */
  Matching.getPendingNum = function(user_id, options={}){
    options = ModelOption.pendingList(user_id, options);
    return this.count(options);
  };

  /**
   * マッチング一覧を取得
   */
  Matching.getMatchingList = function(user_id, options={}){
    options = ModelOption.matchingList(user_id, options);
    return this.findAndCountAll(options);
  };

  /**
   * マッチング履歴を取得
   */
  Matching.getMatchingHistoryList = function(user_id, page, options={}){
    options = ModelOption.matchingHistoryList(user_id, options);
    options.limit = PAGE_COUNT;
    options.offset = PAGE_COUNT * (page-1);
    options.order = [["schedule", "date_key", "DESC"], ["updated_at", "DESC"]];
    return this.findAndCountAll(options);
  };


  /**
   * 依頼する
   */
  Matching.postRequest = function(user_id, schedule_id){
    return this.create({
      schedule_id,user_id,
      status_id: enumMatchingStatus.getCode("request"),
    });
  };

  /**
   * 依頼が承諾可能かどうかチェックする
   */
  Matching.canPostConsent = async function(user_id, matching_id, options={}){
    // ペンディングリストのマッチングのみ承諾可能
    options = ModelOption.pendingList(user_id, options);
    options.where.id = matching_id;
    const count = await this.count(options);
    return count > 0;
  };

  /**
   * 依頼が拒否可能かどうかチェックする
   */
  Matching.canPostReject = async function(user_id, matching_id, options={}){
    // ペンディングリストのマッチングのみ拒否可能
    options = ModelOption.pendingList(user_id, options);
    options.where.id = matching_id;
    const count = await this.count(options);
    return count > 0;
  };

  /**
   * ユーザーがマッチングに属しているかどうかチェックする
   */
  Matching.isBelongs = async function(matching_id, user_id, options={}){
    options = ModelOption.belongsList(user_id, options);
    options.where.id = matching_id;
    const count = await this.count(options);
    return count > 0;
  }

  /**
   * マッチングステータスを更新する
   */
  Matching.updateMatchingStatus = function(matching_id, status_id, options={}){
    options.where = {
      id: matching_id,
    };
    return this.update({status_id}, options);
  };


  return Matching;
};
