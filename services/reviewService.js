const customReviewRepository = require("../models/repository/CustomRepository/reviewRepository");
const pageHelper = require("../common/helper/pageHelper");

/**
 *  user_id: ユーザーのuser_id
 *  page: ページ番号 1-
 *
 */
exports.getUnReviewList = async ({user_id, page=1})=>{
  const data = {
    user_id: user_id,
  }
  const options = {
    page: page,
  };
  const results = await Promise.all([
    customReviewRepository.getUnReviewListResult(data, options),
    customReviewRepository.getUnReviewListCount(data, options),
  ]);
  const count = results[1][0].cnt;
  return {
    rows: results[0],
    pages: pageHelper.makePageObject(count, page),
  };
};

/**
 *  user_id: ユーザーのuser_id
 *  page: ページ番号 1-
 *
 */
exports.getRevieweeHistoryList = async ({user_id, page=1})=>{
  const data = {
    user_id: user_id,
  }
  const options = {
    page: page,
  };
  const results = await Promise.all([
    customReviewRepository.getRevieweeHistoryListResult(data, options),
    customReviewRepository.getRevieweeHistoryListCount(data, options),
  ]);
  const count = results[1][0].cnt;
  return {
    rows: results[0],
    pages: pageHelper.makePageObject(count, page),
  };
};


/**
 *  user_id: ユーザーのuser_id
 *  page: ページ番号 1-
 *
 */
exports.getReviewHistoryList = async ({user_id, page=1})=>{
  const data = {
    user_id: user_id,
  }
  const options = {
    page: page,
  };
  const results = await Promise.all([
    customReviewRepository.getReviewHistoryListResult(data, options),
    customReviewRepository.getReviewHistoryListCount(data, options),
  ]);
  const count = results[1][0].cnt;
  return {
    rows: results[0],
    pages: pageHelper.makePageObject(count, page),
  };
};
