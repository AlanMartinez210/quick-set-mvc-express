/**
 * 不変リストのマスタデータを定義します
 */
exports = {
  getShotTypeName,  // postテーブルのpost_typeの種類
  getPrefName,      // 都道府県
};

const {   // 不変リストのIDマッピングオブジェクト
  SHOT_TYPE_ID_MAP, ALL_PREF_ID_MAP, MATCHING_STATUS_ID_MAP
} = global.C2LINK;



function getShotTypeName(id){
  return SHOT_TYPE_ID_MAP[id].name;
}

function getPrefName(id){
  return ALL_PREF_ID_MAP[id].name;
}
