const sequelize = require('../../models/index').sequelize;
const abstractRepository = require('../abstractRepository');

const matching = require('../../models/matching');
const chat = require('../../models/chat');

const errorHelper = require('../../common/helper/errorHelper');

const matching_select = `
  select matchings.*
       , matchings.id as matching_id
       , matchings.status_id as status_id
       , matchings.created_at as created_at
       , from_user.id as from_user_id
       , from_user.user_name as from_user_user_name
       , from_user.icon_url as from_user_icon_url
       , to_user.id as to_user_id
       , to_user.user_name as to_user_user_name
       , to_user.icon_url as to_user_icon_url
  from matchings
  join schedules on matchings.schedule_id = schedules.id
  left join users from_user  on matchings.user_id = from_user.id
  left join users to_user on matchings.to_user_id = to_user.id
`;


/**
 * マッチング一覧の取得
 *
 * @param {user_id}
 * @return {Promise}
 */
exports.getMatchingList = (user_id)=>{
  const select = matching_select + `
    where to_user_id = :user_id or matchings.user_id = :user_id
    order by matchings.updated_at desc;
  `;
  return abstractRepository.querySelect(select, {user_id});
}

/**
 * マッチング一覧の取得
 *
 * @param {request}
 * @return {Promise}
 */
exports.getMatchingHistoryList = (user_id)=>{
  const select = matching_select + `
    where to_user_id = :user_id or matchings.user_id = :user_id
    order by matchings.updated_at desc
    ;
  `;
  return abstractRepository.querySelect(select, {});
}
