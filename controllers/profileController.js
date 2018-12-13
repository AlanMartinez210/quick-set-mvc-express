const profileVO = require("../viewObjects/mypage");
const db = require("../models/index");
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

	db.User.getUserById(user_id)
	.then(instance => {
		render_obj.bodyData = new profileVO.profileInit(instance);
		res.render('mypage/profile', render_obj);
	})
	.catch(err=>{
    next(err);
  });
}
