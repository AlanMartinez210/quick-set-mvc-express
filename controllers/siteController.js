const mypageVO = require("../viewObjects/mypage");
const userService = require("../services/userService");
const sessionHelper = require('../common/helper/sessionHelper');

/**
 * サイト設定ページの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res){
	var render_obj = res.render_obj;
	render_obj.contentId = "site";
	render_obj.title = "サイト設定";
  var user_id  = sessionHelper.getUserId(req);
  userService.getSiteSettingData(user_id)
  .then(result=>{
		render_obj.bodyData = new mypageVO.siteInfo
		({
			allow_bookmark_notification: result.allow_bookmark_notification,
		});
		res.render('mypage/site', render_obj);
	});
}

/**
 * サイト設定の登録/編集を行います。
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postSiteSetting = (req, res, next) => {
  const registData = req.form_data;
	registData.user_id = sessionHelper.getUserId(req);
	

  // scheduleService.upsertScheduleData(registData)
  // .then(results => {
  //   res.json({status:'success'});
  // }).catch(err => {
  //   next(err);
  // });
}
