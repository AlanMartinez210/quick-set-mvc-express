const userRepository = require('../repository/userRepository');

const sessionHelper = require('../common/helper/sessionHelper');
const hashHelper = require("../common/helper/hashHelper");
const errorHelper = require('../common/helper/errorHelper');

module.exports = {
  loginByIDPW: (user_key, password)=>{
    return userRepository()
    .findOne({where:{user_key}})
    .then(user=>{
      if(!user || user.user_key !== user_key || user.password !== password){
        throw new errorHelper().setWindowMsg('E00001');
      }else{
        return user;
      }
    });
  },
  loginById: (req, user_id)=>{
    return userRepository().findOne({where:{id:user_id}}).then(user=>{
      if(user.id == null){
        throw new errorHelper().setWindowMsg('E00001');
      }
      sessionHelper.setUserData(req, user);
    });
  },
  loginByTwitter:(obj)=>{

  }
}
