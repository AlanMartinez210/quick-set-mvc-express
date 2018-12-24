const pageHelper = require("../common/helper/pageHelper");

/**
 * 未レビュー一覧
 */
class unReviewItem{
  constructor(unReview = {}){
    this.matching_id = unReview.get('id');
    const d = unReview.get('updatedAt');
    this.date_info = {
      key: d.format("L"),
      year: d.year(),
      month: d.trueMonth(),
      day: d.date(),
      week: d.format('ddd')
    }
    this.username = unReview.get('to_user').get('user_name');
  }
}

/**
 * あなたへのレビュー一覧
 */
class revieweeHistoryItem{
  constructor(revieweeHis = {}){
    this.review_id = revieweeHis.get('id');
    const d = revieweeHis.get('updatedAt');
    this.date_info = {
      key: d.format("L"),
      year: d.year(),
      month: d.trueMonth(),
      day: d.date(),
      week: d.format('ddd')
    }
    this.username = revieweeHis.get('user').get('user_name');
    this.type = revieweeHis.get('review_type');
  }
};

/**
 * あなたからのレビュー一覧
 */
class reviewHistoryItem{
  constructor(reviewHis = {}){
    this.review_id = reviewHis.get('id');
    const d = reviewHis.get('updatedAt');
    this.date_info = {
      key: d.format("L"),
      year: d.year(),
      month: d.trueMonth(),
      day: d.date(),
      week: d.format('ddd')
    }
    this.username = reviewHis.get('to_user').get('user_name');
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

    this.unReviewList = {
      rows: unReviewList.rows.map(unReview => new unReviewItem(unReview))
      // pages: pageHelper.makePageObject(unReviewList.count, page),
    };

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
