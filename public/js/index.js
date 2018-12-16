import 'webpack-jquery-ui/datepicker';
import 'webpack-jquery-ui/css';

import myApp from './app';
import { contents } from './content/index';

const c2 = new myApp();
let bodyConfig = "";
let currently_content = "";
window.c2 = c2;

// init run function.
c2.init(() => {
});
// document read complated run function.
c2.ready(() => {
	// bodyのデータ属性を解析し、設定情報を取得する。
	bodyConfig = bodyConfig || c2.bodyParser();
  
	// デザインパターンの設定
	const ptn = setDesignPtn(bodyConfig.cntid);

	// ヘッダーの選択設定
	setHeaderSelect(bodyConfig.cntid);

	// コンテンツIDで指定されたコンテンツを実行します。
	currently_content = currently_content || getContent(bodyConfig.cntid);
  if(currently_content.ready) currently_content.ready();

  c2.config = {
    isCos(){
      return Number(this._ut) === 1;
    },
    isCam(){
      return Number(this._ut) === 2;
    },
    getUserType(){
      return this._ut;
    },
    _ut: bodyConfig.usertype
  }

  // お知らせモーダルを開く
  const $noticeModal = $("#noticeModal");
  $(".general-ptn").on("click", "#noticeBtn", {
    type: "notice",
    onSyncOpenBrefore : (resolve, reject, event) => {
      c2.sendGet(`/api/notice?p=1`, {}, {dataType: "html"})
      .done(result => {
        $noticeModal.html(result);
        
        // さらに読み込む
        $noticeModal.off("click", "[name=noticeMore]");
        $noticeModal.on("click", "[name=noticeMore]", (e) => {
          const notice_id = $(e.target).data("noticeid");
          const $article = $(`[name=noticeArticle${notice_id}]`)
          $article.isVisible() ? $article.hide() : $article.show();
        })

        // ページャー処理
        $noticeModal.off('click', "#noticePager span");
        $noticeModal.on('click', "#noticePager span", (e) => {
          // undefindなら直近の親要素も捜す
          const $t = $(e.target)
          let pageNum = $t.data("page") || $(e.target).closest("span").data("page");

          if($t.hasClass("selected")) return false;
          c2.sendGet(`/api/notice?p=${pageNum}`, {}, {dataType: "html"})
          .done(result => {
            $noticeModal.html(result);
          })
        })

        resolve();
      });
    }
  }, c2.showModal);


  // アンカーイベント
	$('a[href^="#"]').on("click", function() {
    var speed = 400;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });

  // input系の標準イベント
  $("input[type='text'], input[type='password']").on('change', e => {
    c2.clearInputMsg(e.target.name);
  });
  c2.inputClear();

});

// window load complated run function.
c2.load(() => {
  // bodyのデータ属性を解析し、設定情報を取得する。
	bodyConfig = bodyConfig || c2.bodyParser();

  // コンテンツIDで指定されたコンテンツを実行します。
  currently_content = currently_content || getContent(bodyConfig.cntid);
  if(currently_content.load) currently_content.load();

  $('input[data-datepicker]').datepicker();
});

/**
 * デザインパターンを設定します。
 *
 * @param {*} cntId contentId
 * @memberof myApp
 */
function setDesignPtn(cntId){
  // 実際のcntIdと違うものはswitchで変換します。
  let designPtn = "general";
  switch (cntId){
    case "register":
      designPtn = cntId;
      break;
    case "recruit_detail":
      designPtn = "recruitdetail";
      break;
  }

  const ptn = `${designPtn}-ptn`;
  $(".wrap-body-content").addClass(ptn);
  return ptn;
}

/**
 * ページ単位に分割したjsファイルのコンテンツオブジェクトを取得します。
 *
 * @param {*} cntId contentId
 * @memberof myApp
 */
function getContent(cntId){
  // 実際のcntIdと違うものはswitchで変換します。
  let contenId = "";
  switch (cntId){
    case "recruitToday":
      contenId = "recruit";
      break;
    default:
      contenId = cntId;
  }
  if(contents[contenId]) return new contents[contenId]();
  return false;
}

/**
 * contentIdからgeneral-ptn時のヘッダーセレクトを設定します。
 *
 * @param {*} cntId contentId
 */
function setHeaderSelect(cntId){
  // 実際のcntIdと違うものはswitchで変換します。
  let selectId = "mypage";
  switch (cntId){
    case "recruit":
    case "recruitToday":
    case "message":
      selectId = cntId;
      break;
  }

  $(`#${selectId} a`).addClass(`selected`);
}
