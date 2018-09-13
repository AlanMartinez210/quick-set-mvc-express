var userRepository = require('../repository/userRepository');
var sessionHelper = require('../common/helper/sessionHelper');
var hashHelper = require("../common/helper/hashHelper");

/**
 * ユーザーの新規登録を行います。
 *
 * @param {Object} user_data
 */
exports.registerUser = async(user_data)=>{
  user_data.password = hashHelper(user_data.password);
  return userRepository().create(user_data);
};
