var matchingService = require("../services/matchingService");

const errorHelper = require('../common/helper/errorHelper');
const sessionHelper = require('../common/helper/sessionHelper');


/* 依頼する */
exports.postRequest = (req, res, next)=>{
  matchingService.postRequest(req)
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
