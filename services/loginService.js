var userRepository = require('../repository/userRepository');
var sessionHelper = require('../common/helper/sessionHelper');
var hashHelper = require("../common/helper/hashHelper");

module.exports = {
  loginByIDPW: (req)=>{
    var user_key  = req.form_data.user_key;
    var password = hashHelper(req.form_data.password);
    return userRepository()
            .findOne({where:{user_key:user_key}})
            .then(user=>{
              console.log(user);
              if(user.user_key !== user_key || user.password !== password){
                throw {code:'NOT_FOUND', message:'認証情報が間違っています'};
              }
              sessionHelper.setUserData(req, user);
            });
  },
  loginById: (req, user_id)=>{
    return userRepository().findOne({where:{id:user_id}}).then(user=>{
      if(user.id == null){
        throw {code:'NOT_FOUND', message:'認証情報が間違っています'};
      }
      sessionHelper.setUserData(req, user);
    });
  },
  loginByTwitter:(obj)=>{

  }
}
