const abstractRepository = require('./abstractRepository');

const chat = require('../models/chat');

/**
 * ログインユーザーが発言する
 *
 */
exports.postMessage = (matching_id, user_id, message)=>{
   return chat().create({matching_id, user_id, message});
 }
