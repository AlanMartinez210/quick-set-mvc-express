const abstractRepository = require('../abstractRepository');

const chat = require('../../models/chat');


/**
 * ログインユーザーの未読メッセージのあるマッチング一覧を取得
 *
 * @param {integer} user_id
 *
 * @return {promise}
 *
 */
exports.getNewMessageList = (user_id)=>{
  const query = ` select matchings.*,users.user_name,users.icon_url
                from matchings join schedules on schedules.id = matchings.schedule_id join users on users.id = schedules.user_id
                where exists(select * from chats where chats.matching_id = matchings.id and chats.read_count = 0)
                and   matchings.user_id = :user_id
                union all
                select matchings.*,users.user_name,users.icon_url
                from matchings join users on users.id = matchings.user_id
                where  exists(select * from chats where chats.matching_id = matchings.id  and chats.read_count = 0)
                and    exists(select * from schedules where schedules.id = matchings.schedule_id and schedules.user_id = :user_id )
                order by updated_at desc;
              `;
  return abstractRepository().querySelect(query, {user_id});
}
