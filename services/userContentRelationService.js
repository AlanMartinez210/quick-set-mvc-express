const errorHelper = require("../common/helper/errorHelper");
const {Content_chara, User_content_relation} = require("../models/index");

/**
 * ユーザーが登録した衣装一覧
 * user_id: 登録者ID
 */
exports.getUserCostumeList = (user_id)=>{
  return User_content_relation.getUserCostumeList(user_id);
};

/**
 * 衣装を登録
 * user_id: 登録者ID
 * data: 衣装情報
 */
exports.addCostume = async (user_id, {chara_id, remarks} = data)=>{

  // キャラクター情報を取得して存在を確認する。
  const instance = await Content_chara.getCharaById(chara_id)
  
  if(!instance) return Promise.reject( new errorHelper({ status: 400, code: "E00020" }) );

  return User_content_relation.addCostume(user_id, {
    content_id: instance.get("content_title").id,
    chara_id,
    remarks
  });
};

/**
 * 衣装を更新
 * user_id: 登録者ID
 * data: 衣装情報
 */
exports.updateCostume = (user_id, data)=>{
  return User_content_relation.updateCostume(user_id, data);
};


/**
 * 衣装を削除
 * user_id: 登録者ID
 * data: 衣装情報
 */
exports.deleteCostume = (user_id, data)=>{
  return User_content_relation.deleteCostume(user_id, data);
};

/**
 * 衣装を参照
 * user_id: 登録者ID
 * costume_id: 衣装ID
 */
exports.getCostumeById = async (costume_id) => {
  const instance = await User_content_relation.getCostumeByID(costume_id);
  if(!instance) return Promise.reject(new errorHelper({code: "E00000"}));

  return instance;
};