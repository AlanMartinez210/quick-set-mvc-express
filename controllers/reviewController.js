const c_matchingRepository = require("../repository/CustomRepository/matchingRepository");
const c_reviewRepository = require("../repository/CustomRepository/reviewRepository");
const errorHelper = require('../common/helper/errorHelper');

/**
 * レビュー管理の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){

	const render_obj = res.render_obj;

	render_obj.contentId = "review";
	render_obj.title = "メッセージ管理";

	Promise.all([
		c_matchingRepository.getUnReviewList(req),
		c_matchingRepository.getReviewHistoryList(req),
		c_matchingRepository.getRevieweeHistoryList(req),
	]).then(results=>{
		render_obj.bodyData = {
			unReviewList: results[0],
			revieweeList: results[1],
			reviewList: results[2],
		};
		res.render('mypage/review', render_obj);
	});
}


exports.getReviewHistory = function(req, res, next){
	const render_obj = res.render_obj;
	c_matchingRepository.getReviewHistoryList(req).then(result=>{
		render_obj.bodyData = {
			reviewList: result,
		};
		res.render('../content/mypage/review/reviewHistorySection', render_obj);
	});
};

exports.getRevieweeHistory = function(req, res, next){
	const render_obj = res.render_obj;
	c_matchingRepository.getRevieweeHistoryList(req).then(result=>{
		render_obj.bodyData = {
			revieweeList: result,
		};
		res.render('../content/mypage/review/revieweeHistorySection', render_obj);
	});

};
exports.postReview = function(req, res, next){
	c_reviewRepository.postReview(req).then(result=>{
		res.json({status:'success'});
	}).catch(next);
};
