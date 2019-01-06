const mypageService = require("../services/mypageService");
const mypageVO = require("../viewObjects/mypage");
const sessionHelper = require('../common/helper/sessionHelper');

/**
 * マイページの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){

	const render_obj = res.render_obj;
	render_obj.contentId = "mypage";
	render_obj.title = "マイページ";
	const user_id = sessionHelper.getUserId(req);
	Promise.all([
		mypageService.getNoReviewNum(user_id),
		mypageService.getMatchingRequestNum(user_id),
	])
	.then(results => {
		console.log(results);
		render_obj.bodyData = new mypageVO.mypageInit({
      no_review_num: results[0],
      matching_info_num: results[1],
    })
		res.render('mypage/index', render_obj);
	})
	.catch(err => {
		next(err);
	})

}


