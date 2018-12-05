const reviewService = require("../services/reviewService");
const dateHelper = require('../common/helper/dateHelper');
const errorHelper = require('../common/helper/errorHelper');
const sessionHelper = require('../common/helper/sessionHelper');

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
	render_obj.title = "メッセージ管理";

	const user_id = sessionHelper.getUserId(req);
	const page = (req.form_data&&req.form_data.page)||1;
	Promise.all([
		reviewService.getUnReviewList({user_id, page}),
		reviewService.getRevieweeHistoryList({user_id, page}),
		reviewService.getReviewHistoryList({user_id, page}),
	]).then(([unReviewList, revieweeHistoryList, reviewHistoryList])=>{
		render_obj.bodyData = {
			unReviewList: parseUnReviewList(unReviewList),
			revieweeHistoryItem: parseRevieweeHistoryList(revieweeHistoryList),
			reviewHistoryItem: parseReviewHistoryList(reviewHistoryList),
		};
		res.render('mypage/review', render_obj);
	});
}


/**
 * unReviewListのページオブジェクトを作成する
 *
 * @param unReviewList reviewService.getUnReviewListの結果
 */
const parseUnReviewList = (unReviewList) => {
	return {
		rows: unReviewList.rows.map(obj=>{
			return new vo_review.unReviewItem({
				matching_id: obj.matching_id,
				review_date: obj.schedules_date_key,
				user_name: obj.to_user_name,
			});
		}),
		pages: unReviewList.pages,
	};
};
exports.getUnReviewList = async (req, res, next)=>{
	const render_obj = res.render_obj;
	const user_id = sessionHelper.getUserId(req);
	const page = req.form_data.page;

	const unReviewList = await reviewService.getUnReviewList({user_id, page});
	render_obj.bodyData = {
		unReviewList: parseUnReviewList(unReviewList),

	};
	res.render('../content/mypage/review/reviewHistorySection', render_obj);
};


/**
 * revieweeHistoryListのページオブジェクトを作成する
 *
 * @param revieweeHistoryList reviewService.getRevieweeHistoryListの結果
 */
const parseRevieweeHistoryList = (revieweeHistoryList) => {
	return {
		rows: revieweeHistoryList.rows.map(obj=>{
			return new vo_review.revieweeHistoryItem({
				review_id: obj.review_id,
				reviewee_date: obj.schedules_date_key,
				reviewee_user_name: obj.from_user_name,
				review_type: obj.review_type,
			});
		}),
		pages: revieweeHistoryList.pages,
	};
};
exports.getRevieweeHistory = async (req, res, next)=>{
	const render_obj = res.render_obj;
	const user_id = sessionHelper.getUserId(req);
	const page = req.form_data.page;

	const revieweeHistoryList = await reviewService.getRevieweeHistoryList({user_id, page});
	render_obj.bodyData = {
		revieweeHistoryItem: parseRevieweeHistoryList(revieweeHistoryList),
	};
	res.render('../content/mypage/review/revieweeHistorySection', render_obj);
};



/**
 * reviewHistoryListのページオブジェクトを作成する
 *
 * @param reviewHistoryList reviewService.getReviewHistoryListの結果
 */
const parseReviewHistoryList = (reviewHistoryList) => {
	return {
		rows: reviewHistoryList.rows.map(obj=>{
			return new vo_review.reviewHistoryItem({
				review_id: obj.review_id,
				review_date: obj.schedules_date_key,
				review_user_name: obj.to_user_name,
				review_type: obj.review_type,
			});
		}),
		pages: reviewHistoryList.pages,
	};
};
exports.getReviewHistory = async (req, res, next)=>{
	const render_obj = res.render_obj;
	const user_id = sessionHelper.getUserId(req);
	const page = req.form_data.page;

	const reviewHistoryList = await reviewService.getReviewHistoryList({user_id, page});
	render_obj.bodyData = {
		reviewHistoryItem: parseReviewHistoryList(reviewHistoryList),
	};
	res.render('../content/mypage/review/reviewHistorySection', render_obj);
};


exports.postReview = function(req, res, next){
	c_reviewRepository.postReview(req).then(result=>{
		res.json({status:'success'});
	}).catch(next);
};
