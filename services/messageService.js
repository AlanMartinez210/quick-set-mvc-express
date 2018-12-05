const messageRepository = require('../models/repository/customRepository/messageRepository');

/**
 * ログインユーザーの未読メッセージの一覧を取得
 *
 * @param {integer} user_id
 *
 * @return {promise}
 *
 */
exports.getNewMessageList = (user_id)=>{
  return messageRepository.getNewMessageList(user_id);
};
