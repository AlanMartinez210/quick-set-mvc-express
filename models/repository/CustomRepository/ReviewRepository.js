const abstractRepository = require('../abstractRepository')();
const dateHelper = require('../../../common/helper/dateHelper');



/**
 * ユーザーがレビューしていない一覧を取得
 *
 * @param data.user_id ユーザーのuser_id
 */
const getUnReviewList = (select, data = {}, options)=>{
  data.today = data.today||dateHelper.getDate().toDate();
  const query = select + `
    from matchings
    join users as from_user on matchings.user_id = from_user.id
    join users as to_user on matchings.to_user_id = to_user.id
    join schedules on schedules.id = matchings.schedule_id and schedules.date_key <= :today /* 今日以前の日程の募集が対象 */
    where 1=1
    and   ( matchings.user_id = :user_id or matchings.to_user_id = :user_id )
    and   not exists ( select * from reviews where reviews.matching_id = matchings.id)
  `;
  return abstractRepository.querySelect(query, data, options);
};
exports.getUnReviewListResult = (data = {user_id:0}, options={})=>{
  const select = `
    select
      matchings.id as matching_id,
      schedules.date_key as schedules_date_key,
      case when from_user.id = :user_id then from_user.id else to_user.id end as to_user_id,
      case when from_user.id = :user_id then from_user.user_name else to_user.user_name end as to_user_name
  `;
  options = Object.assign({
    orderBy: [["schedules_date_key", "asc"]],
    limit: PAGE_COUNT,
    offset: (options.page-1)*PAGE_COUNT,
  }, options);
  return getUnReviewList(select, data, options);
};
exports.getUnReviewListCount = (data = {user_id:0}, options={})=>{
  const select = `
    select count(1) as cnt
  `;
  return getUnReviewList(select, data, options);
};

/**
 * ユーザーがされたレビューを取得
 *
 * @param data.user_id ユーザーのuser_id
 */
const getRevieweeHistoryList = (select, data = {user_id:0}, options)=>{
  const query = select + `
    from reviews
    join users as from_user on reviews.review_from = from_user.id
    join matchings on matchings.id = reviews.matching_id
    where 1=1
    and   reviews.review_to = :user_id
  `;
  return abstractRepository.querySelect(query, data, options);
};
exports.getRevieweeHistoryListResult = (data = {user_id:0}, options)=>{
  const select = `
    select
      reviews.id as review_id,
      matchings.id as matching_id,
      (select date_key from schedules where id = matchings.schedule_id) as schedules_date_key,
      from_user.id as from_user_id,
      from_user.user_name as from_user_name,
      reviews.review_type as review_type
  `;
  options = Object.assign({
    orderBy: [["schedules_date_key", "asc"]],
    limit: PAGE_COUNT,
    offset: (options.page-1)*PAGE_COUNT,
  }, options);
  return getRevieweeHistoryList(select, data, options);
};
exports.getRevieweeHistoryListCount = (data = {user_id:0}, options)=>{
  const select = `
    select count(1) as cnt
  `;
  return getRevieweeHistoryList(select, data, options);
};

/**
 * ユーザーがしたレビューを取得
 *
 * @param data.user_id ユーザーのuser_id
 */
const getReviewHistoryList = (select, data = {user_id:0}, options)=>{
  const query = select + `
    from reviews
    join users as to_user on reviews.review_to = to_user.id
    join matchings on matchings.id = reviews.matching_id
    where 1=1
    and   reviews.review_from = :user_id
  `;
  return abstractRepository.querySelect(query, data, options);
};
exports.getReviewHistoryListResult = (data = {user_id:0}, options)=>{
  const select = `
    select
      reviews.id as review_id,
      matchings.id as matching_id,
      (select date_key from schedules where id = matchings.schedule_id) as schedules_date_key,
      to_user.id as to_user_id,
      to_user.user_name as to_user_name,
      reviews.review_type as review_type
  `;
  options = Object.assign({
    orderBy: [["schedules_date_key", "asc"]],
    limit: PAGE_COUNT,
    offset: (options.page-1)*PAGE_COUNT,
  }, options);
  return getReviewHistoryList(select, data, options);
};
exports.getReviewHistoryListCount = (data = {user_id:0}, options)=>{
  const select = `
    select count(1) as cnt
  `;
  return getReviewHistoryList(select, data, options);
};
