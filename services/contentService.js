const errorHelper = require("../common/helper/errorHelper");
const db = require("../models/index");

/**
 * 作品情報を取得します。
 * 
 * @param {number} title_id content_title - ID
 * 
 * @returns {object} sequelize object
 */
exports.getTitle = (title_id) => {
  return db.Content_title.getContentTitleById(title_id)
  .then(instance => {

    // 作品情報がなければエラーを返す。
    return instance || Promise.reject(new errorHelper({ status: 400, code: "E00020" }));
  });
};


/**
 * キャラクターIDからキャラクター情報を取得します。
 * 
 * @param {number} content_id content_chara - ID
 * 
 * @returns {object} sequelize object
 */
exports.getChara = (chara_id) => {
  return db.Content_chara.getCharaById(chara_id)
  .then(instance => {
    
    // キャラクター情報がなければエラーを返す。
    return instance || Promise.reject(new errorHelper({ status: 400, code: "E00020" }));
  });
};

/**
 * 作品情報を新規登録します。
 * 
 * @param {number} user_id users - ID
 * @param {object} data: 作品情報のデータ {}
 * 
 * @returns {object} sequelize object
 */
exports.createTitle = (user_id, {title_name, sub_title, abbreviation} = data) => {
  const regist_data = {
    name: title_name,
    sub_title: sub_title,
    abbreviation: abbreviation,
    create_user_id: user_id
  };
  return db.Content_title.addContentTitle(regist_data)
  .then(instance => {
    // 登録した情報がなければエラーにする。
    return instance || Promise.reject(new errorHelper({ status: 500, code: "fatal" }));
  });
};

/**
 * キャラクター情報を新規登録します。
 * 
 * @param {number} user_id users - ID
 * @param {object} data: キャラクター情報のデータ
 * 
 * @returns {object} sequelize object
 */
exports.createChara = async (user_id, {title_id, chara_name, nickname, name_type} = data) => {

  // 作品情報が存在するか？
  const isTitle = await db.Content_title.isExist(title_id);

  // 存在しなければエラー
  if(!isTitle) return Promise.reject(new errorHelper({ status: 400, code: "E00020" }));

  // TODO name_typeに応じて、名前の整形を行う。
  switch(Number(name_type)){
    case 1: // 名前のみ => そのまま登録
    case 2: // 姓 名 => 項目間に空白を挿入して連結する
    case 3: // 多項数名 => 項目間に・(中黒)を挿入して連結する。
  }

  const regist_data = {
    content_title_id: title_id,
    name: chara_name,
    nickname: nickname,
    name_type: name_type,
    create_user_id: user_id
  };

  const instance = await db.Content_chara.addChara(regist_data);

  // 登録した情報がなければエラーにする。
  return instance || Promise.reject(new errorHelper({ status: 500, code: "fatal" }));
};

/**
 * キーワードからキャラクター情報を検索する。
 * 
 * @param {string} keyword キーワード
 * 
 * @returns {Array} sequelize object array
 */
exports.searchContentChara = (keyword) => {
  const options = {};

  // 曖昧検索
  options.where = {
    name: {
      [db.sequelize.Op.like]: '%' + db.sequelize.rawEscape(keyword) + '%'
    }
  };
  return db.Content_chara.search(options);
};

/**
 * キーワードから作品情報を検索する。
 * 
 * @param {string} keyword キーワード
 * 
 * @returns {Array} sequelize object array
 */
exports.searchContentTitle = (keyword) => {
  const options = {}
  // 曖昧検索
  options.where = {
    name: {
      [db.sequelize.Op.like]: '%' + db.sequelize.rawEscape(keyword) + '%'
    }
  };
  return db.Content_title.search(options);
};