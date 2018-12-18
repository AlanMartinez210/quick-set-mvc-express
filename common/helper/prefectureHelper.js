const prefecture = require("jp-prefecture");
/**
 * 都道府県IDから都道府県名を取得します。
 * @param {*} prefId 都道府県IDの配列
 * @deprecated
 */
exports.getPrefectureNameByIds = (prefIds = []) => {
  return prefIds.map(v => {
    return prefecture.findBy("pref", "id", Number(v), "name");
  });
}

/**
 * 都道府県IDから都道府県名を取得します。
 * @param {*} prefId
 */
exports.getPrefectureNameById = (prefId) => {
  return prefecture.findBy("pref", "id", Number(prefId), "name");
}

/**
 * togouhukenn
 * 道府県名から都道府県IDを取得します。
 * @deprecated
 */
exports.getPrefectureIdByName = (prefNameArr = []) => {
  return prefNameArr.map(v => {
    return prefecture.findBy( "pref", "name", v, "id");
  });
}

exports.getAllPrefList = ()=>{
  return prefecture.getAll("pref", ["id", "name"]);
}
