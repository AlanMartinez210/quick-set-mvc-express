const errorHelper = require("../common/helper/errorHelper");
const {Content_chara} = require("../models/index");

/**
 * content_id: キャラクターID
 */
exports.getChara = (content_id)=>{
  return Content_chara.getChara(content_id);
};

/**
 * user_id: 登録者ID
 * data: キャラクター情報
 */
exports.addChara = (user_id, data)=>{
  return Content_chara.addChara(user_id, data);
};
