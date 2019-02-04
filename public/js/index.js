import 'webpack-jquery-ui/datepicker';
import 'webpack-jquery-ui/css';

import myApp from './app';
import costume from './content/mypage/costume';

const c2 = new myApp();

// init run function.
c2.init(() => {
});
// document read complated run function.
c2.ready(() => {
  
	// デザインパターンの設定
	setDesignPtn(c2.config.cntid);
	// ヘッダーの選択設定
	setHeaderSelect(c2.config.cntid);

  // アプリケーションの独自コンフィグを設定
  c2.setConfig({
    isCos(){
      return Number(c2.config.usertype) === 1;
    },
    isCam(){
      return Number(c2.config.usertype) === 2;
    },
    getUserType(){
      return c2.config.usertype;
    },
  })

  // アプリケーションのlocalStorage操作メソッドを定義します。
  window.setLSUserData = (user_data) => {
    localStorage.setItem('myUserData', JSON.stringify(user_data));
  }
  window.getLSUserData = () => {
    const d = localStorage.getItem('myUserData').length;
    return d ? JSON.parse(d): {};
  }
  window.setLSCostumeData = (costume_data) => {
    localStorage.setItem('myCostumeData', JSON.stringify(costume_data));
  }
  window.getLSCostumeData = () => {
    const d = localStorage.getItem('myCostumeData').length;
    return d ? JSON.parse(d): {};
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
  }, e => c2.showModal(e));

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

  $(".help-tip").on('click', e => {
    // ダイアログ
    c2.showInfoDialog({
      name: "helpTextDialog",
      title: "入力のヒント",
      text: $(e.currentTarget).data("help_text")
    })
    
  });

  // test
  $(".ajaxtest").click(() => {
    c2.sendGet("/t/e/403", {});
  })
});

// window load complated run function.
c2.load(() => {
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
    case "message":
      designPtn = cntId;
      break;
    case "recruit_detail":
      designPtn = "recruitdetail";
      break;
  }

  const ptn = `${designPtn}-ptn`;
  $(".wrap-body-content").addClass(ptn);
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
