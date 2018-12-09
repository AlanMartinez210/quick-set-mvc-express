const pageHelper = require("../common/helper/pageHelper");

/**
 * 未レビュー一覧
 */
class unReviewItem{
  constructor({matching_id = "", review_date = {}, user_name = ""}){
    this.matching_id = matching_id;
    this.date = review_date ? review_date.format("L") : "";
    this.username = user_name;
  }
}

/**
 * あなたへのレビュー一覧
 */
class revieweeHistoryItem{
  constructor({review_id = "", reviewee_date = {}, reviewee_user_name = "", review_type = ""}){
    this.review_id = review_id;
    this.date = reviewee_date ? reviewee_date.format("L") : "";
    this.username = reviewee_user_name;
    this.type = review_type;
  }
};

/**
 * あなたからのレビュー一覧
 */
class reviewHistoryItem{
  constructor({review_id = "", review_date = {}, review_user_name = "", review_type = ""}){
    this.review_id = review_id;
    this.date = review_date ? review_date.format("L") : "";
    this.username = review_user_name;
    this.type = review_type;
  }
}


module.exports = class{
  constructor(user_id, {
    unReviewList,  /** Matching.getNoReviewList **/
    revieweeHistoryList, /** Review.getRevieweeHistoryList **/
    reviewHistoryList, /** Review.getReviewHistoryList **/
  }, page=1 /** page番号 **/){
    this.unReviewList = {
      rows: unReviewList.rows.map(matching=>{
        // 自分が送ったマッチングと受け取ったマッチングで表示する項目を分ける
        const user = user_id!=matching.get('user_id')?matching.get('user'):matching.get('to_user');

        return new unReviewItem({
          matching_id: matching.get('id'),
          review_date: matching.get('createdAt'),
          user_name: user.get('user_name'),
        });
      }),
      pages: pageHelper.makePageObject(unReviewList.count, page),
    };
    this.revieweeHistoryItem = {
      rows:revieweeHistoryList.rows.map(review=>{
        return new revieweeHistoryItem({
          review_id: review.get('id'),
          reviewee_date: review.get('createdAt'),
          reviewee_user_name: review.get('user').get('user_name'),
          review_type: review.get('review_type'),
        });
      }),
      pages: pageHelper.makePageObject(revieweeHistoryList.count, page),
    };
    this.reviewHistoryItem = {
      rows:reviewHistoryList.rows.map(review=>{
        return new reviewHistoryItem({
          review_id: review.get('id'),
          review_date: review.get('createdAt'),
          review_user_name: review.get('to_user').get('user_name'),
          review_type: review.get('review_type'),
        });
      }),
      pages: pageHelper.makePageObject(revieweeHistoryList.count, page),
    };
  }
};
