var chai = require('chai');
var should = chai.should();
var scheduleService = require("../../services/reviewService");
const {req, res, next} = require('../expressModule/controllerHelper').getControllerArguments();
var grobleValue = require("../../common/middleware/globalVariables")(req, res, next);


describe('test-reviewService', ()=>{
  var user_id = 1234;
  var page = 2;

    it('test：getUnReviewList', () =>  {
      return scheduleService.getUnReviewList({user_id, page})
      .then(res => {
        // console.log('res');
        // console.log(res);
        res.pages['now_page'].should.equal(page);
      })
    });

    it('test:getRevieweeHistoryList', () =>  {
      return scheduleService.getRevieweeHistoryList({user_id, page})
      .then(res => {
        // console.log('res');
        // console.log(res);
        res.pages['now_page'].should.equal(page);
      })
    });

    it('test:getReviewHistoryList', () =>  {
      return scheduleService.getReviewHistoryList({user_id, page})
      .then(res => {
        // console.log('res');
        // console.log(res);
        res.pages['now_page'].should.equal(page);
      })
    });
});