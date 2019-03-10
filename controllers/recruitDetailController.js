const recruitDetailVO = require("../viewObjects/recruitDetail");
const dateHelper = require("../common/helper/dateHelper");

const db = require("../models/index");

/**
 * 募集の詳細ページ
 *
 * @param {*} req
 * @param {*} res
 */
exports.getRecruitDetail = async(req, res, next)=>{
	const scheduleOptions = {};
	
	const schedule_id = req.params.schedule_id;
	scheduleOptions.include = [{ all: true, nested: true}];
	const schedule = await db.Schedule.getSchedule(schedule_id, options);

	// スケジュールデータがなければエラーにする。
	if(!schedule) 
	// スケジュールに属するレビューデータの取得
	const reviewData = await db.Review.getRevieweeHistoryList(schedule.get("user_id"));

	console.log('user_id: ', user_id);

	// const results = await function(){
	// 	return Promise.all([
	// 		db.Schedule.getSchedule(schedule_id, options),
	// 		db.Review.getRevieweeHistoryList()
	// 	])
	// }();

	
	const schedule = await db.Schedule.getSchedule(schedule_id, options);

	// レビュー情報の取得

	
	const recruit_detail_item = new recruitDetailVO.recruit_detail_item(schedule);
	res.json(recruit_detail_item);
	
}

/**
 * 募集の詳細ページ(外部アクセス)
 *
 * @param {*} req
 * @param {*} res
 */
exports.entryOutSide = function(req, res, next){
	const render_obj = res.render_obj;
	// const user_type = sessionHelper.getUserData(req);

	render_obj.contentId = "recruit_detail";
	render_obj.title = "予定の詳細";

	const vo = {
		schedule_id: 60,
		bgImage: "bg.jpg",
		good_review_num: 10,
		bad_review_num: 1,
		user_info: {id: 4, name: "test_cosplayer_1", icon: "" },
		date_info: dateHelper.createDate(2018, 10, 29),
		event_info: {
			shot_type: 1,
			title: "世界コスプレサミット",
			url: "http://test.com/event/site",
			prefectures: ["神奈川県", "東京都"],
			tags: ["カメラOK", "ストロボあり"]
		},
		user_tags: ["一眼あり", "撮影経験豊富"],
		review_info: [
			{type: 1, comment: "とても良いです。"},
			{type: 2, comment: "とても悪いです。"},
			{type: 1, comment: "とても良いです。"}
		],
		remarks: "これはテストです。"
	}

	render_obj.bodyData = new recruitDetailVO.recruit_detail_item(vo);
	res.render('recruitList/detail', render_obj);

}
