/**
 * ページオブジェクトを作成する
 * @param count 合計件数
 * @param now_page 現在のページ番号
 *
 * @return PagerObject
 *
 */
exports.makePageObject = (count, now_page)=>{
  return {
    count: count,
    now_page: now_page,
    max_page: Math.ceil(count/PAGE_COUNT),
  };
}
