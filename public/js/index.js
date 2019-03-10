import 'webpack-jquery-ui/datepicker';
import 'webpack-jquery-ui/css';

import myApp from './app';

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
    isCos(isRequired = false){
      if(isRequired && !c2.config.usertype) return location.href = "/t/e/500/1";
      return Number(c2.config.usertype) === 1;
    },
    isCam(isRequired = false){
      if(isRequired && !c2.config.usertype) return location.href = "/t/e/500/1";
      return Number(c2.config.usertype) === 2;
    },
    getUserType(isRequired = false){
      if(isRequired && !c2.config.usertype) return location.href = "/t/e/500/1";
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

  // モーダル閉じる共通
  $('[name=doCloseModal]').on('click', e => c2.showClearAll())

  // ヘルプモーダル
  $('body').on('click', '[data-helpmodal]', {
    type: "help"
  }, e => c2.showModal(e));

  // イメージモーダル
  const $modal_box = $(".modal-box");
  $('body').on('click', '[data-imagemodal]', {
    type: "image",
    onSyncOpenBrefore: (resolve, reject, event) => {
      const $t = $(event.currentTarget);
      const image_key = $t.data("imagemodal");
      // 同一キーを持つイメージ要素を取得
      const $image_wrap = $(".image-wrap");

      const img_obj = new Image();
      img_obj.onload = function(e){
        $modal_box.css({
          'max-width': `${this.width}px`,
          'max-height': `${this.height}px`
        })
        $image_wrap.append(`
          <img src='${this.src}' style='width:100%; height:100%;'>
        `);
        resolve();
      }
      img_obj.src = $(`.${image_key}`).prop("src");

    },
    onCloseBrefore: (event) => {
      $(".image-wrap").empty();
      $modal_box.css({
        'max-width': '',
        'max-height': ''
      })
    }
  }, e => c2.showModal(e));

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
          const $t = $(e.target);
          const notice_id = $t.data("noticeid");
          const $article = $(`[name=noticeArticle${notice_id}]`)
          if($article.isVisible()){
            $t.text("さらに読み込む");
            $article.hide();
          }else{
            $t.text("閉じる");
            $article.show();
          }
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
  $("input[type='text'], input[type='password'], select").on('change', e => {
    c2.clearInputMsg(e.target.name);
  });
  c2.inputClear();

  // 入力項目のヘルプ
  $(".help-tip").on('click', e => {
    const $t = $(e.currentTarget);
    if($t && $t.length){
      let title = $t.find(".main-label").text();
      c2.showInfo(`${title ? title : "入力のヒント"}: <br />${$t.data("help_text")}`);
    }
  });
  
  // 残文字数の表示
  $("input, textarea").on('focus', e => {
    const $t = $(e.currentTarget);
    const mx = $t.prop("maxlength");

    if(mx <= 0) return false;

    const cr = $t.val().length;

    let style = "font-size:13px;position:absolute;top:0;right:24px;background:#FFF;";
    if((mx - cr) < 0) style += "color:#e74c3c;";

    $t.parent().after(`<p class="input-str-num" style="${style}">残り${mx-cr}文字</p>`);

    const $str_num = $($t.parent().parent().find(".input-str-num"));

    // 表示文字の更新
    const timer_id = setInterval(() => {
      const crn = $t.val().length;
      // if((mx-crn) > 0){
      //   $str_num.removeClass("c-red");
      // }else{
      //   $str_num.addClass("c-red");
      // }
      $str_num.text(`残り${mx-crn}文字`);
    }, 500);

    // イベントセット
    $t.off('blur');
    $t.on('blur', e => {
      clearInterval(timer_id);
      $str_num.remove();
    })
  })
  
  // test
  $(".ajaxtest").click(() => {
    c2.sendGet("/t/e/403/1", {});
  })
});

// window load complated run function.
c2.load(() => {
  $('input[data-datepicker]').datepicker();
  const start_date = $('input[data-datepickerstart]').datepicker().on('change', function(){
    end_date.datepicker("option", "minDate", this.value ? this.value : null);
  });

  const end_date = $('input[data-datepickerend]').datepicker().on('change', function(){
    start_date.datepicker("option", "maxDate", this.value ? this.value : null);
  });
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
    case "messageRoom":
      designPtn = "message"
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
