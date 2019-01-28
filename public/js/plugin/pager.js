export default class pager{
  constructor(app){
    this.app = app;
  }
  ready(contentSection = []){
    
    contentSection.forEach(e => {
      const $t = $(`#${e}`);
      const pager_name = $t.find("[data-listpager]")[0].dataset.listpager;

      $t.on('click', `[data-listpager=${pager_name}] li`, e => {
        const $e = $(e.currentTarget);
        const ch = $e.children();
        if(ch.length && !ch.hasClass("invisible") && ch.data("page_url")){
          this.app.sendGet(ch.data("page_url"), {}, {dataType: "html"})
          .done(res => $t.html(res))
        }
      })
    });
  }
}

