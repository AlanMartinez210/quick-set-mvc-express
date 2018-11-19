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
	res.render('mypage/site', render_obj);
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
