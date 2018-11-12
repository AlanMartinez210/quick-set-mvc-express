/**
 * ページオブジェクトを作成する
 * @param count 合計件数
 * @param now_page 現在のページ番号
 *
 * @return PagerObject
 *
 */
exports.makePageObject = (count = 0, now_page = 0, p_count = global.PAGE_COUNT)=>{
  count = parseInt(count), now_page = parseInt(now_page);

  const disp_page_list = [];
  const disp_page = 5;
  const max_page = Math.ceil(count/p_count) > 0 ? Math.ceil(count/p_count) : 1;
  now_page = Math.max(1, Math.min(now_page, max_page)); //now_pageがページャーの範囲外だったら修正する

  let first_disp_page = Math.max(1, Math.min(max_page-disp_page+1, now_page-parseInt(disp_page/2)));
  let last_disp_page  = Math.min(max_page, first_disp_page+disp_page-1);
  for(let i=first_disp_page;i<=last_disp_page;i++){
    disp_page_list.push(i);
  }

  return {
    count: count,
    now_page: now_page,
    max_page: max_page,
    disp_page_list :disp_page_list,
  };
}
