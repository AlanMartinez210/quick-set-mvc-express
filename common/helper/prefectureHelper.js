const prefecture = require("jp-prefecture");
/**
 * 都道府県IDから都道府県名を取得します。
 * @param {*} prefId 都道府県IDの配列
 */
exports.getPrefectureNameByIds = (prefIds = []) => {
  return prefIds.map(v => {
    return prefecture.findBy("pref", "id", v, "name");
  });
}

/**
 * togouhukenn
 * 道府県名から都道府県IDを取得します。
 */
exports.getPrefectureIdByName = (prefNameArr = []) => {
  return prefNameArr.map(v => {
    return prefecture.findBy( "pref", "name", v, "id");
  });
}

exports.getAllPrefList = ()=>{
  return prefecture.getAll("pref", ["id", "name"]);
}
