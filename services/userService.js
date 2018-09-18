const userRepository = require('../repository/userRepository');

const sessionHelper = require('../common/helper/sessionHelper');
const hashHelper = require("../common/helper/hashHelper");
const errorHelper = require('../common/helper/errorHelper');

/**
 * ユーザーの新規登録を行います。
 *
 * @param {Object} user_data
 */
exports.registerUser = async(user_data) => {
  user_data.password = hashHelper(user_data.password);
  return userRepository().register(user_data)
  .then(res => {
    return res;
  });
};

/**
 * ユーザーIDとパスワードでログインを行います。
 */
exports.login = (login_key, password)=>{
  // ログインキーがユーザーキーと仮定してユーザーデータを取得する。
  return userRepository().findUser(login_key)
  .then(res => {
    return res;
  })
  // .then(user=>{
  //   if(!user || user.user_key !== user_key || user.password !== password){
  //     throw new errorHelper().setWindowMsg('E00001');
  //   }else{
  //     return user;
  //   }
  // });
},

exports.loginById = (req, user_id)=>{
  return userRepository().findOne({where:{id:user_id}}).then(user=>{
    if(user.id == null){
      throw new errorHelper().setWindowMsg('E00001');
    }
    sessionHelper.setUserData(req, user);
  });
}


  // loginByTwitter:(obj)=>{

  // }


// .then(row=>{
//   if(row.user_key){
//     sessionHelper.setUserData(req, row);
//   }else{
//     return Promise.reject(errorHelper.message({code:"E00001"}));
//   }
// });
