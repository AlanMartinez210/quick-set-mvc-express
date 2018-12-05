const abstractRepository = require('../abstractRepository')();
const sequelize = require('../../index').sequelize;

const matching = require('../../matching');
const chat = require('../../chat');

const errorHelper = require('../../../common/helper/errorHelper');
const dateHelper = require('../../../common/helper/dateHelper');

const c2link4DiService = require('../../../services/c2link4DiService');
const enumMatchingStatus = c2link4DiService.enumMatchingStatus();

const matching_select = `
  select matchings.*
       , matchings.id as matching_id
       , matchings.status_id as status_id
       , matchings.created_at as created_at
       , schedules.date_key as schedule_date_key
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
 * @param {integer} user_id ユーザーのID
 * @param {Moment} date_key このパラメータに指定した日付以降の募集に対するマッチングのデータを取得
 *
 * @return {Promise}
 */
exports.getMatchingList = ({user_id, date_key=dateHelper.getDate()}, options={logging: true})=>{
  const select = matching_select + `
    where ( to_user_id = :user_id or matchings.user_id = :user_id )
    and schedules.date_key >= :date_key
    and matchings.status_id in (:status_id)
    order by matchings.id desc
  `;
  return abstractRepository.querySelect(select, {
    user_id: user_id,
    date_key: date_key.toDate(),
    status_id: [
      enumMatchingStatus.getCode("request"),
      enumMatchingStatus.getCode("matching"),
    ]
  }, options);
}

/**
 * 過去のマッチング一覧の取得
 *
 * @param {integer} user_id ユーザーのID
 * @param {Moment} date_key このパラメータに指定した日付より前の募集に対するマッチングのデータを取得
 *
 * @param {request}
 * @return {Promise}
 */
exports.getMatchingHistoryList = ({user_id, date_key=dateHelper.getDate()}, options={logging: true})=>{
  const select = matching_select + `
    where (to_user_id = :user_id or matchings.user_id = :user_id)
    and (schedules.date_key < :date_key or matchings.status_id in (:status_id))
    order by matchings.id desc
  `;
  return abstractRepository.querySelect(select, {
    user_id: user_id,
    date_key: date_key.toDate(),
    status_id: [
      enumMatchingStatus.getCode("reject"),
    ]
  }, options);
}
