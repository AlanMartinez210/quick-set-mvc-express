const userRepository = require('../repository/userRepository');
const dateHelper = require('../common/helper/dateHelper');
const hashHelper = require("../common/helper/hashHelper");
const errorHelper = require('../common/helper/errorHelper');

/**
 * ユーザーを新規作成します。
 *
 * @param {Object} user_data
 */
exports.createUser = (user_data) => {
  user_data.password = hashHelper(user_data.password);
  return userRepository().getUserByEmail(user_data.email)
  .then(res => {
    // メールアドレスからユーザーが取得できたらエラー
    if(res.length > 0) return Promise.reject(new errorHelper({http_status: 400}).addErrorData({view_id: "email", code: "E00010"}));
    return userRepository().create(user_data);
  })
  .then(res => {
    return res;
  });
};

/**
 * ログインキー(user_key or email)とパスワードでログイン対象のユーザーを取得を行います。
 */
exports.getloginUserData = (login_key, password) => {
  password = hashHelper(password);
  // ログインキーがユーザーキーと仮定してユーザーデータを取得する。
  return userRepository().getUserByUserKeyOrEmail(login_key, password)
  .then(res => {
    const login_user_data = res[0];
    // ユーザーが存在しない場合はエラーを返す。
    if(!login_user_data) return Promise.reject(new errorHelper().setWindowMsg("E00001"));
    return login_user_data;
  });
}

/**
 * 対象のユーザーの有効期限が切れていないかチェックします。
 */
exports.checkExpirationDate = (expiration_date) => {
  return new Promise((resolve, reject) => {
    const today = dateHelper.getDate();
    const expiration = dateHelper.getDate(expiration_date);
    if(expiration.isSameOrAfter(today)){
      resolve(true);
    }
    else{
      reject(new errorHelper().setWindowMsg("E00009"));
    }
  }) 
}

/**
 * 対象のユーザーの有効期限をクリアし、更新したユーザーデータを返します。
 */
exports.clearExpirationDate = (user_id) => {
  return userRepository().deleteExpirationDate(user_id)
  .then(res => {
    if(res){
      return userRepository().getUserById(user_id);
    }else{
      return Promise.reject(new errorHelper().setWindowMsg("E00000"));
    }
  })
}

/**
 * 対象のユーザーに有効期限を設定します。
 */
exports.setExpirationDate = (user_id) => {
  const expiration_date = dateHelper.getDate().add(7, 'days').toDate();
  return userRepository().updateExpirationDate(user_id, expiration_date)
  .then(res => {
    if(res){
      return userRepository().getUserById(user_id);
    }else{
      return Promise.reject(new errorHelper().setWindowMsg("E00000"));
    }
  })
}