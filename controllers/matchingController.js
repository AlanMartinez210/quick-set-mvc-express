const vo_matching = require("../viewObjects/matching");
const matchingService = require("../services/matchingService");
const sessionHelper = require("../common/helper/sessionHelper");
const c2Util = require('../services/c2link4DiService');

/**
 * マッチングの管理の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
  const render_obj = res.render_obj;
  render_obj.contentId = "matching";
  render_obj.title = "マッチングの管理";
  render_obj.backBtn = c2Util.getBackMypageBtn();

  const user_id = sessionHelper.getUserId(req);
  Promise.all([
    matchingService.getMatchingList(user_id),
    matchingService.getMatchingHistoryList(user_id),
  ])
  .then(([matchingList, matchingHistoryList])=>{
    render_obj.bodyData = new vo_matching.matching_page(user_id, matchingList, matchingHistoryList);
    res.render('mypage/matching', render_obj);
  }).catch(next);

}

/* 依頼する */
exports.postRequest = (req, res, next)=>{
  const user_id = sessionHelper.getUserId(req);
  const schedule_id = req.form_data.schedule_id;
  
  matchingService.postRequest(user_id, schedule_id)
  .then(row=>{
    console.log(row);
    res.json({status:'success'});
  }).catch(next);
}

/* 依頼を承諾する */
exports.postConsent = (req, res, next)=>{
  const user_id = sessionHelper.getUserId(req);
  const matching_id = req.form_data.matching_id;
  matchingService.postConsent(user_id, matching_id)
  .then(row=>{
		console.log(row);
    res.json({status:'success'});
	}).catch(next)
}

/* 依頼を却下する */
exports.postReject = (req, res, next)=>{
  const user_id = sessionHelper.getUserId(req);
  const matching_id = req.form_data.matching_id;
  matchingService.postReject(user_id, matching_id)
  .then(row=>{
		console.log(row);
    res.json({status:'success'});
	}).catch(next)
}