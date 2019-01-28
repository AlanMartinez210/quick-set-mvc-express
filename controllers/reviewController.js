const reviewService = require("../services/reviewService");
const sessionHelper = require('../common/helper/sessionHelper');
const c2Util = require('../services/c2link4DiService');

const vo_review = require('../viewObjects/review');

/**
 * レビュー管理の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	const render_obj = res.render_obj;
	render_obj.contentId = "review";
	render_obj.title = "レビューの管理";
	render_obj.backBtn = c2Util.getBackMypageBtn();

	const user_id = sessionHelper.getUserId(req);
	Promise.all([
		reviewService.getUnReviewList(user_id),
		reviewService.getRevieweeHistoryList(user_id),
		reviewService.getReviewHistoryList(user_id),
	]).then(([unReviewList, revieweeHistoryList, reviewHistoryList])=>{
		render_obj.bodyData = new vo_review(user_id, {unReviewList, revieweeHistoryList, reviewHistoryList});
		res.render('mypage/review', render_obj);
	}).catch(next);
}

// exports.getUnReviewList = async (req, res, next)=>{
// 	const render_obj = res.render_obj;
// 	const user_id = sessionHelper.getUserId(req);
// 	const page = req.form_data.page;

// 	const unReviewList = await reviewService.getUnReviewList({user_id, page});
// 	render_obj.bodyData = new vo_review(user_id, {unReviewList}, page);
// 	res.render('../content/mypage/review/reviewHistorySection', render_obj);
// };


exports.getRevieweeHistory = async (req, res, next)=>{
	const render_obj = res.render_obj;
	const user_id = sessionHelper.getUserId(req);
	const page = req.form_data.page;

	const revieweeHistoryList = await reviewService.getRevieweeHistoryList({user_id, page});
	render_obj.bodyData = new vo_review(user_id, {revieweeHistoryList}, page);
	res.render('../content/mypage/review/revieweeHistorySection', render_obj);
};

exports.getReviewHistory = async (req, res, next)=>{
	const render_obj = res.render_obj;
	const user_id = sessionHelper.getUserId(req);
	const page = req.form_data.page;

	const reviewHistoryList = await reviewService.getReviewHistoryList({user_id, page});
	render_obj.bodyData = new vo_review(user_id, {reviewHistoryList}, page);
	res.render('../content/mypage/review/reviewHistorySection', render_obj);
};

exports.postReview = function(req, res, next){
	// FIX formdataつかって
	c_reviewRepository.postReview(req).then(result=>{
		res.json({status:'success'});
	}).catch(next);
};
