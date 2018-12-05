const abstractRepository = require('../abstractRepository');

/**
 * ログインユーザーの未読メッセージのあるマッチング一覧を取得
 *
 * @param {integer} user_id
 *
 * @return {promise}
 *
 */
exports.getNewMessageList = (user_id)=>{
  // 自分への発言が未読になっているチャットが含まれているマッチングの情報を取得と、相手のユーザー情報を取得
  const query = `select matchings.*,
                        users.user_name,users.icon_url
                 from matchings
                 join users on users.id in (matchings.user_id, matchings.to_user_id) and users.id <> :user_id
                 where exists (
                   select * from chats
                   where to_user_id = :user_id
                   and matching_id = matchings.id
                   and read_flag = 0
                 )
                 order by updated_at desc;
              `;
  return abstractRepository().querySelect(query, {user_id});
}
