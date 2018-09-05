var userRepository = require('../repository/userRepository');
var sessionHelper = require('../common/helper/sessionHelper');
var hashHelper = require("../common/helper/hashHelper");

/**
 * ユーザーの新規登録を行います。
 * 
 * @param {*} req 
 */
exports.registerUser = (req)=>{
  req.form_data.password = hashHelper(req.form_data.password);
  return userRepository().create(req.form_data);
};
