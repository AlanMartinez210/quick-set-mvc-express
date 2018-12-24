const mypageVO = require("../viewObjects/mypage");
const userService = require("../services/userService");
const c2Util = require("../services/c2link4DiService");
const sessionHelper = require('../common/helper/sessionHelper');

/**
 * サイト設定ページの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function (req, res) {
  var render_obj = res.render_obj;
  render_obj.contentId = "site";
  render_obj.title = "サイト設定";
  render_obj.backBtn = c2Util.getBackMypageBtn();
  const user_id = sessionHelper.getUserId(req);
  userService.getSiteSettingData(user_id)
    .then(result => {
      render_obj.bodyData = new mypageVO.siteInfo(result);
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
  const formData = req.form_data;
  const user_id = sessionHelper.getUserId(req);
  userService.updateSiteSetting(user_id, formData)
  .then(result => {
    res.json({status:'success'});
  }).catch(err => {
    next(err);
  });
}