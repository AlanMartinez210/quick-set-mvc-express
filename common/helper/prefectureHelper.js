/**
 * 都道府県IDから都道府県名を取得します。
 * @param {*} prefId 都道府県IDの配列
 */
exports.getPrefectureNameByIds = (prefIds) => {
  let prefectureNames = new Array();
  if(prefIds != null){
    for(let id of prefIds){
      prefectureNames.push(global.C2LINK.ALL_PREF_ID_MAP[id].name);
    }  
  }
  return prefectureNames;
}
