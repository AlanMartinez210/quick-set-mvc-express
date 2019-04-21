const errorHelper = require("../common/helper/errorHelper");
const db = require("../models/index");

/**
 * 作品参照
 *  content_id: 作品ID
 */
exports.getContentTitle = (content_id)=>{
  return db.Content_title.getContentTitle(content_id);
};

/**
 * 作品登録
 * user_id: 登録者ID
 * data: 作品情報
 */
exports.addContentTitle = (user_id, data)=>{
  return db.Content_title.addContentTitle(user_id, data);
};

/**
 * 作品検索
 * name: 作品タイトル
 */
exports.searchContentTitle = (keyword)=>{
  const options = {}
  // 曖昧検索
  options.where = { name: { [db.sequelize.Op.like]: '%' + db.sequelize.rawEscape(keyword) + '%'} };
  return db.Content_title.search(options);
};
