const sequelize = require('../../models/index').sequelize;

const chat = require('../../models/chat');


module.exports = {
  getNewMessageList,
  postMessage,
};

/**
 * ログインユーザーの未読メッセージの一覧を取得
 *
 * @param {request}
 *
 * @return {promise}
 *
 */
function getNewMessageList(req){
  var data = {
    user_id: req.session.user.id,
  };
  return new Promise((resolve,reject)=>{
    var query = ` select matchings.*,users.user_name,users.icon_url
                  from matchings join schedules on schedules.id = matchings.schedule_id join users on users.id = schedules.user_id
                  where exists(select * from chats where chats.matching_id = matchings.id )
                  and   matchings.user_id = :user_id
                  union all
                  select matchings.*,users.user_name,users.icon_url
                  from matchings join users on users.id = matchings.user_id
                  where  exists(select * from chats where chats.matching_id = matchings.id )
                  and    exists(select * from schedules where schedules.id = matchings.schedule_id and schedules.user_id = :user_id )
                  order by updated_at desc;
                `;

    var queryOption = {
      type: sequelize.Sequelize.QueryTypes.SELECT,
      replacements: data,
    }
    Promise.all([
      sequelize.query(query, queryOption),
    ]).then(results=>{
      resolve(results[0]);
    }).catch(reject);
  });
}


/**
 * ログインユーザーが発言する
 *
 */
 function postMessage(req){
   var data = {
     matching_id: req.form_data.matching_id,
     user_id: req.session.user.id,
     message: req.form_data.message,
   };
   return chat().create(data);
 }
