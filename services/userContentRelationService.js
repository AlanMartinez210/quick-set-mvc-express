const errorHelper = require("../common/helper/errorHelper");
const {User_content_relation} = require("../models/index");

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
exports.addCostume = (user_id, data)=>{
  return User_content_relation.addCostume(user_id, data);
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


