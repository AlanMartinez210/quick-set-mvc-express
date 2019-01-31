const pageHelper = require("../common/helper/pageHelper");

/**
 * 未レビュー一覧
 */
class unReviewItem{
  constructor(unReview = {}){
    this.matching_id = unReview.get('id');
    this.date_info = unReview.get('updatedAt').getDateInfo();
    this.username = unReview.get('to_user').get('user_name');
    this.user_icon = unReview.get('to_user').get('icon_url');
  }
}

/**
 * あなたへのレビュー一覧
 */
class revieweeHistoryItem{
  constructor(revieweeHis = {}){
    this.review_id = revieweeHis.get('id');
    this.date_info = revieweeHis.get('updatedAt').getDateInfo();
    this.username = revieweeHis.get('user').get('user_name');
    this.user_icon = revieweeHis.get('user').get('icon_url');
    this.type = revieweeHis.get('review_type');
  }
};

/**
 * あなたからのレビュー一覧
 */
class reviewHistoryItem{
  constructor(reviewHis = {}){
    this.review_id = reviewHis.get('id');
    this.date_info = reviewHis.get('updatedAt').getDateInfo();
    this.username = reviewHis.get('to_user').get('user_name');
    this.user_icon = reviewHis.get('to_user').get('icon_url');
    this.type = reviewHis.get('review_type');
  }
}


/**
 *
 *
 * @param user_id ログイン者のユーザーID
 * @param unReviewList 未レビュー一覧
 * @param revieweeHistoryList あなたへのレビュー一覧
 * @param reviewHistoryItem
 * @param page ページ番号
 */
module.exports = class{
  constructor(user_id, { unReviewList, revieweeHistoryList, reviewHistoryList }, page = 1){

    this.unReviewList = unReviewList.rows.map(unReview => new unReviewItem(unReview))

    this.revieweeHistoryItem = {
      rows:revieweeHistoryList.rows.map(revieweeHis => new revieweeHistoryItem(revieweeHis)),
      pages: pageHelper.makePageObject(revieweeHistoryList.count, page),
    };

    this.reviewHistoryItem = {
      rows:reviewHistoryList.rows.map(reviewHis => new reviewHistoryItem(reviewHis)),
      pages: pageHelper.makePageObject(revieweeHistoryList.count, page),
    };
  }
};
