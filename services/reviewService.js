const {Matching, Review} = require("../models/index");

/**
 *  user_id: ユーザーのuser_id
 *  page: ページ番号 1-
 *
 */
exports.getUnReviewList = (user_id, page=1)=>{
  return Matching.getNoReviewList(user_id, page);
};

/**
 * 自分がされたレビュー一覧
 *
 *  user_id: ユーザーのuser_id
 *  page: ページ番号 1-
 */
exports.getRevieweeHistoryList = (user_id, page=1)=>{
  const option = {};

  options.limit = PAGE_COUNT;
  options.offset = PAGE_COUNT * (page-1);

  return Review.getRevieweeHistoryList(user_id, option);
};


/**
 * 自分がしたレビュー一覧
 *
 *  user_id: ユーザーのuser_id
 *  page: ページ番号 1-
 */
exports.getReviewHistoryList = (user_id, page=1)=>{
  return Review.getReviewHistoryList(user_id, page);
};


/**
 * レビューを送信する
 *
 */
exports.postReview = ({matching_id, user_id, review_type, review_comment})=>{
  return Review.postReview(matching_id, user_id, review_type, review_comment);
};
