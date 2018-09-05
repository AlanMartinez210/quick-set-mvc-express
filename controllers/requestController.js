var requestForm = require("../form/requestForm");
var userRepository = require("../repository/userRepository");
var matchingService = require("../services/matchingService");

const errorHelper = require('../common/helper/errorHelper');


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
  c_matchingRepository.postConsent(req)
  .then(row=>{
		console.log(row);
    res.json({status:'success'});
	}).catch(next)
}

/* 依頼を却下する */
exports.postReject = (req, res, next)=>{
  c_matchingRepository.postReject(req)
  .then(row=>{
    res.json({status:'success'});
	}).catch(next)
}
