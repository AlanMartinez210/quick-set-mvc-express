var profileService = require("../services/profileService");
const profileVO = require("../viewObjects/mypage");
const sessionHelper = require("../common/helper/sessionHelper");

/**
 * プロフィール編集画面の表示
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.index = (req, res, next) => {
	const render_obj = res.render_obj;
	render_obj.contentId = "profile";
	render_obj.title = "プロフィール編集";
	var user_id  = sessionHelper.getUserId(req);
	profileService.getProfileEditViewData(user_id)
	.then(result=>{
		render_obj.bodyData = new profileVO.profileInfo
		({
			icon_url: result.icon_url,
			user_name: result.user_name,
			email: result.email,
			prefectures: result.prefectures,
			tags: result.tags 
		});
		res.render('mypage/myprofile', render_obj);
	});
}
//exports.postUserLoginByTwitter = function(req, res){
//
//
//	/**
//	 * form内のパスワードをhashHelperを使い変換します。
//	 */
//	registerData.password = hashHelper(registerData.password);
//	/**
//	 * userRepositoryを使いユーザーの取得を行います。
//	 */
//	twitterRepository().loginTwitter(registerData)
//	.then(user=>{
//
//	}).catch(err=>{
//
//	});
//
//}
