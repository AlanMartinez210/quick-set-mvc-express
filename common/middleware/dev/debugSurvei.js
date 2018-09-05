/**
 * development環境時にアクセス内容を監視します。
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = function(req, res, next) {
	console.log("debugSurvei ON!")
	console.log(`request url: ${req.url}`);
	console.log("req.headers.c2linkapikey", req.headers.c2linkapikey);
	console.log('req.headers', req.headers);


	// req.headers.c2linkapikeyが含まれていた場合、そのユーザーIDでログインする
	if(req.headers.c2linkapikey){
		// 偶数の場合で存在しなかったらコスプレイヤーを作成してログイン
		// 奇数の場合で存在しなかったらカメラマンを作成してログイン
		if(req.headers.c2linkapikey%2 == 0)
			loginCosplayer(req, req.headers.c2linkapikey);
		else
			loginCameraman(req, req.headers.c2linkapikey);

		// res.renderに渡す値を返却する
		res.render = (txt, obj)=>{
			res.json(obj.bodyData)
		};
	}
	next();
}

const userRepo = require('../../../repository/userRepository');
const sessionHelper = require('../../../common/helper/sessionHelper');
const loginCosplayer = (req, user_id)=>{
	var user_obj = {id:user_id, user_name:"コスプレイヤー" + user_id, password: "pass", email:`cos${user_id}@cos.com`, user_type:1};
  sessionHelper.setUserData(req, user_obj);
	userRepo().create(user_obj).then(console.log);
};

const loginCameraman = (req, user_id)=>{
	var user_obj = {id:user_id, user_name:"テストカメラマン" + user_id, password: "pass", email:`cam${user_id}@cam.com`, user_type:2};
	sessionHelper.setUserData(req, user_obj);
	userRepo().create(user_obj).then(console.log);
};
