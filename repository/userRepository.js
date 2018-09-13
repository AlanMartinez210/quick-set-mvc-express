var abstractRepository = require('./abstractRepository');
const user = require('../models/user');
const hashHelper = require("../common/helper/hashHelper");
const sessionHelper = require("../common/helper/sessionHelper");
const errorHelper = require('../common/helper/errorHelper');

var repo;
module.exports = () =>{
	// リポジトリは2回以上作成しない
	repo = repo || Object.assign(userRepository, abstractRepository(user))
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
	// /**
	//  * プロフィール編集画面の表示に必要な情報を取得する
	//  * ユーザー名、(パスワード)、メールアドレス、活動地域、タグ
	//  */
	// getProfileEditViewData: (req)=>{
	// 	const data = {
	// 		user_id: req.session.user.id
	// 	};
	// 	return new Promise((resolve, reject)=>{
	// 		result = {};
	// 		user().findOne({where:{id:data.user_id},attributes:['user_name','email']}).then(row=>{
	// 			if(row) {
	// 				result.user_name = row.user_name;
	// 				result.email = row.email;
	// 				resolve(result);
	// 			} else {
	// 				reject();
	// 			}
	// 		}).catch(reject);
	// 	});
	// }
};
