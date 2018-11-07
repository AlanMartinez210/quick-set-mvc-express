/**
 * ページオブジェクトを作成する
 * @param count 合計件数
 * @param now_page 現在のページ番号
 *
 * @return PagerObject
 *
 */
exports.makePageObject = (count, now_page)=>{

  const disp_page_Arr = []
  let disp_page = 5;
  const max_page = Number(count) > 0 ? Math.ceil(count/10) : 1;
  disp_page = disp_page > max_page ? max_page : disp_page;

  const lim = Math.floor(disp_page/2) > 0 ? Math.floor(disp_page/2) : 1;
  const res = Number(now_page) + lim ;
  let dispMax = res > max_page ? max_page : res < disp_page ? disp_page : res;

  dispMax += 1;
  for(var i=disp_page;i>0;i--){
    const c = (dispMax - i);
    if(c <= 0) break;
    disp_page_Arr.push(c);
  }

  return {
    count: count,
    now_page: now_page,
    max_page: max_page,
    disp_page_list :disp_page_Arr
  };
}
