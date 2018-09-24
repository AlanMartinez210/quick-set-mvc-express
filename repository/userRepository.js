var abstractRepository = require('./abstractRepository');

const hashHelper = require("../common/helper/hashHelper");
const sessionHelper = require("../common/helper/sessionHelper");
const errorHelper = require('../common/helper/errorHelper');

var repo;
module.exports = () =>{
	// リポジトリは2回以上作成しない
	repo = repo || Object.assign(userRepository, abstractRepository("User"))
	return repo;
}

const userRepository = {
	/**
	 * ログインする
	 */
	doLogin: (req)=>{
		return repo.findOne({
			where: { user_key: req.form_data.userid, password:hashHelper(req.form_data.password)},
		}).then(row=>{
			if(row.user_key){
				sessionHelper.setUserData(req, row);
			}else{
				return Promise.reject(errorHelper.message({code:"E00001"}));
			}
		});
	},
	/**
	 * ユーザー登録してログインする
	 */
	register: (req)=>{
		req.form_data.password = hashHelper(req.form_data.password);
		return user().create(req.form_data).then(user=>{
			sessionHelper.setUserData(req, user);
			return user;
		});
	},
};
