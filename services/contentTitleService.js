const errorHelper = require("../common/helper/errorHelper");
const {Content_title} = require("../models/index");

/**
 * 作品参照
 *  content_id: 作品ID
 */
exports.getContentTitle = (content_id)=>{
  return Content_title.getContentTitle(content_id);
};

/**
 * 作品登録
 * user_id: 登録者ID
 * data: 作品情報
 */
exports.addContentTitle = (user_id, data)=>{
  return Content_title.addContentTitle(user_id, data);
};

/**
 * 作品検索
 * name: 作品タイトル
 */
exports.searchContentTitle = ({name})=>{
  return Content_title.searchContentTitle({name});
};
