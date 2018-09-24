const abstractRepository = require('./abstractRepository');

let repo;
module.exports = () =>{
  // リポジトリは2回以上作成しない
  repo = repo || Object.assign(messageRepository, abstractRepository("Chat"))
  return repo;
}

const messageRepository = {
  /**
   * ログインユーザーが発言する
   *
   */
  postMessage(matching_id, user_id, message){
    return chat().create({matching_id, user_id, message});
  }
}
