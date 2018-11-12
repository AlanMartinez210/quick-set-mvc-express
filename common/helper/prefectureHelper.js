/**
 * 都道府県IDから都道府県名を取得します。
 * @param {*} prefId 都道府県IDの配列
 */
exports.getPrefectureNameByIds = (prefIds = []) => {
  return prefIds.map(v => global.C2LINK.ALL_PREF_ID_MAP[v].name)
}

/**
 * togouhukenn 
 * 道府県名から都道府県IDを取得します。
 */
exports.getPrefectureIdByName = (prefNameArr = []) => {
  const prefArr = global.C2LINK.ALL_PREF_LIST.filter(v => {
    return prefNameArr.indexOf(v.name) >= 0
  });
  return prefArr.map(v => v.id);
}
