const db = require("../models/index");
const errorHelper = require("../common/helper/errorHelper");

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

/**
 * メッセージルームのメッセージ一覧を取得
 */
exports.getMessageList = async(matching_id, user_id)=>{
  if(await db.Matching.isBelongs(matching_id, user_id)){
    return db.Chat.getMessageList(matching_id);
  }else{
    // 自分に関係ないマッチングのチャットを見ようとした場合
    return Promise.reject(new errorHelper().setWindowMsg("E00015"));
  }
}

/**
 * 発言する
 */
exports.postMessage = async(user_id, matching_id, message)=>{
  if(await db.Matching.isBelongs(matching_id, user_id)){
    return db.Chat.postMessage(user_id, matching_id, message);
  }else{
    // 自分に関係ないマッチングのチャットに発言した場合
    return Promise.reject(new errorHelper().setWindowMsg("E00015"));
  }
}
