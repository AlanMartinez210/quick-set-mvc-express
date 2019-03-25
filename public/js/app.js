import { baseApp } from './baseApp';
import { Plagins } from './plugin/index';
import { contents } from './content/index';

import _forEach from 'lodash/forEach';
import _chain from 'lodash/chain';
import _partial from 'lodash/partial';
import _split from 'lodash/split';
import _isObject from 'lodash/isObject';

let currently_content = "";

/**
 * アプリケーションの標準機能を提供します。
 *  - このクラスは以下の内容を扱います。
 *    - 画面読み込み処理
 *    - ajax共通処理
 *    - プログレスバー
 *    - モーダル
 *    - ダイアログ
 *
 * @export
 * @class myApp
 * @extends {baseApp}
 */
export default class myApp extends baseApp {
  constructor() {
    super();
    this.config = {};
    this.plugin = {};
    _forEach(Plagins, (plg, key) => {
      let c = new plg();
      this.plugin[key] = c;
    });

    // window[app_name] = this;
  }

  /** =======================================================
   * #### 画面読み込み処理
   ========================================================== */

  /**
   * documentのonloadイベントに登録する関数を定義します。
   *   - この処理はbaseAppのready関数に渡されます。
   *
   * @param {*} fn
   * @memberof myApp
   */
  ready(fn){

    // appコンフィグにbodyConfigを追加
    super.ready(() => {
      this.config = this.bodyParser()
    });

    // index.jsの共通処理
    super.ready(fn);

    // コンテンツの読み込み
    super.ready(() => {
      // コンテンツIDで指定されたコンテンツを実行します。
      currently_content = getContent(this);
      if(currently_content.ready) currently_content.ready();

      
      // readyメソッドを持つプラグインの実行
      _forEach(this.plugin, p => {
        if(p.ready) p.ready(this);
      })

      // 画面の表示
      const $mainFrame = $('.wrap-body-content');
      $mainFrame.fadeIn("fast");
    })
  }

  load(fn){

    // 事前処理
    super.load(() => {
    // bodyのデータ属性を解析し、設定情報を取得する。

    // コンテンツIDで指定されたコンテンツを実行します。
    currently_content = currently_content || getContent(this);
      if(currently_content.load) currently_content.load();
    });

    // index.jsの共通処理
    super.load(fn);

    super.load(() => {

      // refresh_eventの確認 TODO 後で拡張する。
      let refresh_event = window.sessionStorage.getItem(['refresh_event']);
      // すぐ消す
      window.sessionStorage.removeItem(['refresh_event']);
      if(refresh_event){
        refresh_event = JSON.parse(refresh_event);
        Object.keys(refresh_event).forEach(key => {
          this[key](refresh_event[key]);
        })
      }

      // loadメソッドを持つプラグインの実行
      _forEach(this.plugin, p => {
        if(p.load) p.load(this);
      })
    });
  }

  /**
   *bodyのdata-*を取得する。
   *
   * @returns
   * @memberof myApp
   */
  bodyParser(){
    const body = document.getElementsByTagName('body')[0];
    return _isObject(body.dataset) ? Object.assign({}, body.dataset) : {};
  }

  /**
   * app.configに値を追加します。
   * 
   * @param {*} obj 
   */
  setConfig(obj = {}){
    this.config = this.config || {}
    Object.assign(this.config, obj);
  }

  /** =======================================================
   * #### ajax共通処理
   ========================================================== */

  /**
   * ajax処理を実行します。
   *
   * @param {string} method (POST|GET|PUT|DELETE)
   * @param {string} url
   * @param {JSON} data
   * @return {jqXHR}
   * @memberof myApp
   */
  sendAjax(method, url, data, option){

    this.onShowProgress();

    const ajaxOption = {
      type: method,
      timeout : 30000,
      cache: false,
      header: {}
    }

    if(!option.dataType){
      ajaxOption.dataType = "json";
    }

    if(ajaxOption.dataType === 'json'){
      ajaxOption.contentType = 'application/json';
      if(Object.keys(data).length > 0) Object.assign(ajaxOption, {data: JSON.stringify(data)});
    }
    else{
      Object.assign(ajaxOption, option);
      Object.assign(ajaxOption, {data: data});
    }

    console.log(" -> send options: ", ajaxOption);

    return $.ajax(url, ajaxOption)
    .always(res => {
      console.log(" -> response params: ", res)
    })
    .done(() => {
      this.onHideProgress();
    })
    .fail(res => {
      // ajaxエラー処理

      this.hideDialog();

      // エラーレスポンスがない場合は500エラー
      if(!res.responseJSON) location.href = "/500/error";
      
      const err_json = res.responseJSON;
      console.log('err_json: ', err_json);

      // 規定のエラーでなければ500エラー
      if(err_json.name !== 'ErrorHelper') location.href = "/500/error";
      
      // HTTPエラーによってエラー工程を振り分ける
      switch(Number(err_json.status)){
        case 401: 
        case 403:
          //認証エラー
          location.href = "/401/error";
          break;
        case 400:
          this.onHideProgress();
          if(err_json.window_msg) this.showErrMsg(err_json.window_msg);
          
          //form項目エラー

          // 項目にエラーを反映する。
          for(const ed of  err_json.error_data){
            const $box_item = $(`#box_${ed.view_id}`);
            if(!$box_item[0]) continue;
            $box_item.addClass('error-input').find(".bottom-label").text(ed.err_message);
          }

          break;
        default:
          location.href = err_json.redirect_to || "/500/error";
      }
    });
  }

  /**
   * POSTでajaxを実行します。
   *
   * @param {string} url
   * @param {JSON} data
   * @return {jqXHR}
   * @memberof myApp
   */
  sendPost(url, data = {}, option = {}){
    return this.sendAjax("POST", url, data, option);
  }

  /**
   * GETでajaxを実行します。
   *
   * @param {string} url
   * @param {JSON} data
   * @return {jqXHR}
   * @memberof myApp
   */
  sendGet(url, data = {}, option = {}){
    return this.sendAjax("GET", url, data, option);
  }

  /**
   * DELETEでajaxを実行します。
   *
   * @param {string} url
   * @param {JSON} data
   * @return {jqXHR}
   * @memberof myApp
   */
  sendDelete(url, data = {}, option = {}){
    return this.sendAjax("DELETE", url, data, option);
  }

  /**
   * DELETEでajaxを実行します。
   *
   * @param {string} url
   * @param {JSON} data
   * @return {jqXHR}
   * @memberof myApp
   */
  sendPut(url, data = {}, option = {}){
    return this.sendAjax("PUT", url, data, option);
  }


  /** =======================================================
   * #### プログレスバー
   ========================================================== */

  /**
   * プログレスバーを表示します。
   *
   * @memberof myApp
   */
  onShowProgress(){
    const progress = document.getElementById("progress");
    progress.style.display = "block";
  }

  /**
   * プログレスバーを非表示にします。
   *
   * @memberof myApp
   */
  onHideProgress(){
    const progress = document.getElementById("progress");
    progress.style.display = "none";
  }

  /**
   * モーダル用プログレスバーを表示します。
   *
   * @memberof myApp
   */
  onShowProgressModal(){

  }

  /**
   * モーダル用プログレスバーを非表示にします。
   *
   * @memberof myApp
   */
  onHideProgressModal(){

  }

  /** =======================================================
   * #### inputボトムメッセージ
   ========================================================== */

  /**
   * インプットのボトムメッセージを表示します。
   *
   * @param {*} view_id (input name)
   * @param {*} message
   * @memberof myApp
   */
  showInputErr(view_id, message){
    $(`#box_${view_id}`).addClass('error-input').find(".bottom-label").text(message);
  }

  /**
   * インプットのボトムメッセージをクリアします。
   *
   * @param {*} view_id (input name)
   * @memberof myApp
   */
  clearInputMsg(view_id){
    $(`#box_${view_id}`).removeClass('error-input').find(".bottom-label").text("");
  }

  /** =======================================================
   * #### モーダル
   ========================================================== */


  /**
   * モーダルを表示します。
   *
   * @param {*} e
   */
  showModal(e){
    $(".wrapper").css({"paddingRight": (window.innerWidth - document.body.clientWidth) + "px"});
    $("body").addClass("on-modal");

    const modal_name = `${e.data.type}Modal`;

    // 同期版
    if(e.data.onOpenBrefore){
      this.onShowProgress();
      e.data.onOpenBrefore(e);
      this.onHideProgress();
    }

    // 非同期版
    if(e.data.onSyncOpenBrefore){
      this.onShowProgress();
      const preModalProc = new Promise((resolve, reject) => {
        return e.data.onSyncOpenBrefore(resolve, reject, e);
      });
      preModalProc
      .then(() => {
        this.onHideProgress();
        $(`#${modal_name}`).attr("data-modal", "show");
      })
      .catch(err => {
        this.onHideProgress();
        this.showClearAll(modal_name);
        this.showErrMsg("処理に失敗しました。改善しない場合は、一度ログアウトし、再度ログインしてお試しください。")
      })
    }
    else{
      $(`#${modal_name}`).attr("data-modal", "show");
    }

    const modal_close_obj = $("#modal-close, #modal-close-btn");
    
    if(e.data.onCloseBrefore){  // 閉じる処理(同期)
      // 登録イベントを一旦破棄する。
      modal_close_obj.on('click', (ev) => {
        if($(ev.currentTarget).hasClass("child-modal")) return false;

        this.onShowProgress();
        e.data.onCloseBrefore(ev);
        this.onHideProgress();
        this.showClearAll(modal_name);
      });
    }
    else if(e.data.onSyncCloseBrefore){ // 閉じる処理(非同期)
      modal_close_obj.on('click', (ev) => {
        if($(ev.currentTarget).hasClass("child-modal")) return false;

        this.onShowProgress();
        const preCloseProc = new Promise((resolve, reject) => {
          return e.data.onSyncCloseBrefore(resolve, reject, ev);
        })
        preCloseProc
        .then(() => {
          this.onHideProgress();
          this.showClearAll(modal_name);
        })
        .catch(err => {
          this.onHideProgress();
          this.showClearAll(modal_name);
          this.showErrMsg("処理に失敗しました。改善しない場合は、一度ログアウトし、再度ログインしてお試しください。");
        })
      });
    }
    else{
      modal_close_obj.on('click', e => {
        if($(e.currentTarget).hasClass("child-modal")) return false;

        this.showClearAll(modal_name);
      });
    }

    $(".modal-box").on('click', e => {
      e.stopPropagation();
    });

  	return false;
  };

  /**
   * すべてのモーダルを非表示にします。
   */
  showClearAll(modal_name){
    $(".on-show").removeClass("on-show");
    $(".on-show-acd-inner").removeClass("on-show-acd-inner");
    // 項目の非表示
    if(modal_name) $(`#${modal_name} [data-mdc]`).hide();
  	$(".wrapper").css({"paddingRight": "0px"});
  	$("body").removeClass("on-modal");
    $(".modal-box").find("[data-modal='show']").attr("data-modal", "hide");
    $("#modal-close, #modal-close-btn").off('click');
  }

  /**
   * モーダルを親子関係を設定して開きます。
   * 
   * @param {*} modalName モーダルの名称
   * @param {*} isKeepParentPosition 子モーダルを開いた時の親モーダルの位置を保持する
   */
  showChildModal({modalName, isKeepParentPosition: ture} = param){
    const $modalBody = $("#modal-close");
    const $backParentBtn = $("#modal-back-btn");

    // 初期化
    $backParentBtn.off("click");
    $modalBody.removeClass("child-modal");
    $modalBody[0].dataset.p =keepParentPosition ? $modalBody.scrollTop() : 0;

    // 現在開いてるモーダルのIDを取得する。
    const parentModalId = $modalBody.find("[data-modal='show']")[0].id;

    // モーダルに子モーダル設定をします。
    $modalBody.addClass('child-modal');
    $modalBackBtn.on('click', () => {
      // 子モーダルの解除
      $modalBody.removeClass("child-modal");
      switchModal(parentModalId);
      $modalBody.scrollTop(0, $modalBody[0].dataset.p || 0);
      $modalBody[0].dataset.p = 0;
    });

    switchModal(parentModalId);
  }

  /** 
   * 現在表示しているモーダルと指定したモーダルの表示を入れ替えます。
   * 
   * @param {*} modalName モーダルの名称
   * 
   */
  switchModal (modalName){
    const $modalBody = $("#modal-close");
    const $changeModal = $("#"+ modalName);

    // 現在開いているモーダルを閉じる
    $modalBody.find("[data-modal='show']")[0].dataset.modal = "hide";
    
    // 目的のモーダルを開く
    $changeModal[0].dataset.modal = "show";
  }

  /**
   * 指定したモーダルコンテンツにオーバーレイヤーをかけます。
   */
  addProtectModalCnt(modalName){
    const boardList = document.querySelectorAll(`#${modalName}Modal .board-cnt`);

    if(boardList.length > 0){
      _forEach(boardList, (v) => {
        const div = document.createElement('div');
        div.classList.add('modal-protect');
        v.appendChild(div);
      })
    }
  }

  /**
   * 指定したモーダルコンテンツのオーバーレイヤーを削除します。
   */
  removeProtectModalCnt(){
    const modalProtect = document.getElementsByClassName("modal-protect");
    if(modalProtect.length > 0){
      _forEach(modalProtect, (v) => {
        if(v) v.parentNode.removeChild(v);
      })
    }
  }

  /** =======================================================
   * #### インスタントメッセージ
   *  - インスタントメッセージは内容の文字数に応じて表示時間が自動設定されます。
   *  - 非表示処理は基本的に呼ばないでください。
   ========================================================== */

  /**
   * インスタントメッセージを表示します。
   *
   * @param {string} [mesObj={type: "info", messageStr: ""}]
   * @memberof myApp
   */
  showMessage(mesObj = {type: "info", messageStr: ""}){

    // 既存のものを消す。
    $("body").find(".instantMessage").remove();

    if(!this.instant_count) this.instant_count = 0;
    this.instant_count++;
    
    let delay = (mesObj.messageStr.length / 6) * 1000;
    delay = delay < 3000 ? 3000 : delay;

    const t = `instantMessage_${this.instant_count}`

    // メッセージの生成と表示
    const mesHtml = `
      <div id="${t}" class="instantMessage shadow-d">
        <p class="message-str msg-${mesObj.type}">${mesObj.messageStr}</p>
        <span class="msg-close"><i class="fas fa-times"></span></i>
      </div>`;

    // メッセージのクリアを設定
    $("body").on('click',  `#${t}, #${t} .msg-close`, () => {
      this.clearMessage(t);
    })

    $("body").prepend(mesHtml);

    $("body").find(`#${t}`).animate({
      top: "8px",
      opacity: 1
    }, 300);

    setTimeout(()=>{
      this.clearMessage(t);
    }, delay);

  }

  /**
   * インフォメーションインスタントメッセージを表示します。
   *
   * @param {*} msgStr
   * @memberof myApp
   */
  showInfo(msgStr){
    this.showMessage({type: "info", messageStr: msgStr});
  }

  /**
   * 警告インスタントメッセージを表示します。
   *
   * @param {*} alertMsg
   * @memberof myApp
   */
  showAlert(alertMsg){
    this.showMessage({type: "warn", messageStr: alertMsg});
  }

  /**
   * エラーインスタントメッセージを表示します。
   *
   * @param {*} alertMsg
   * @memberof myApp
   */
  showErrMsg(errMsg){
    this.showMessage({type: "err", messageStr: errMsg});
  }

  /**
   * インスタントメッセージを非表示にします。
   *
   * @param {*} alertMsg
   * @memberof myApp
   */
  clearMessage(target){
    $("body").find(`#${target}`).animate({
      top: "0px",
      opacity: 0
    }, 300, () => {
      $("body").find(`#${target}`).remove();
    });
  }


  /** =======================================================
   * #### ダイアログ
   ========================================================== */

  /**
   * インフォメーション用のダイアログを表示します。
   */
  showInfoDialog({name, title, text} = dialogObj){
    return this._showDialog(name, title, text, "info");
  }

  /**
   * 警告用のダイアログを表示します。
   */
  showWarnDialog({name, title, text} = dialogObj){
    return this._showDialog(name, title, text, "warn");
  }

  /**
   * エラー用のダイアログを表示します。
   */
  showErrDialog({name, title, text} = dialogObj){
    return this._showDialog(name, title, text, "err");
  }

  /**
   * DialogIdで指定したダイアログの生成、表示を行います。
   *
   * @param {*} DialogId
   * @returns
   * @memberof myApp
   */
  _showDialog(name, title, text = "", type){

    // ダイアログタイトルHTML定義
    const dTitle = title ? `
      <div class='dialog-title board-hdr'>
        <p class='title-str dialog-${type}'>${title}</>
      </div>` : "";
    
    // ダイアログをbodyの直前に定義します。
    $("body").prepend(`
      <div id='dialog_overlay' class='ovarlay-dialog-wrap'></div>
      <div id='dialog_body' class='confirm-dialog-wrap' name='${name}'>
        <div class='confirm-dialog board-prm'>
          ${dTitle}
          <div class='dialog-cnt board-cnt'>${text}</div>
          <div class='dialog-ftr board-ftr flex _jr'>
            <button class='dialog-close btn-prm st-line-b' name='dialogClose'>閉じる</button>
          </div>
        </div>
			</div>
    `);

    // ダイアログ展開中のエンターキーの仕様を禁止する。
    $(function(){
      $("input, button").on("keydown", function(e) {
        if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
            return false;
        } else {
            return true;
        }
      });
    });

    const $footer = $(`[name=${name}] .dialog-ftr`);
    const $closeBtn = $(`[name=${name}] [name=dialogClose]`);
    $closeBtn.on('click', this.hideDialog);

    /**
     * メソッドが呼ばれた時に生成されます。
     */
    return {
      count: 0,
      addBtn: function({label = "はい", callback = function(){}} = {}){
        let btnName = `dialogBtn${this.count}`;
        this.count++;
        $footer.append(`<button class='dialog-btn btn-prm st-back-b shadow-l' name='${btnName}'>${label}</button>`);
        $(`[name=${name}] [name=${btnName}]`).on('click', callback);
        return this;
      },
      closelabel: function(label = "閉じる"){
        $closeBtn.text(label);
        return this;
      }
    }
  }

  /**
   * ダイアログを非表示にします。
   *
   * @memberof myApp
   */
  hideDialog(){
    $("input, button").off("keydown");
    $('#dialog_overlay, #dialog_body').remove();
  }

  /** =======================================================
   * #### その他
   ========================================================== */

  inputClear(){
    let inputName = "";
    let target = "";
    $("[name=inputClear]").each((i, ele) => {
      $(ele).on('click', e => {
        inputName = $(ele).data("inputclear");
        target = `input[data-inputclear="${inputName}"]`;
        $(target).val("");
        // datepickerオブジェクト
        if(typeof($(target).datepicker) ==  "function"){
          $(target).datepicker("option", "minDate", null);
          $(target).datepicker("option", "maxDate", null);
        }
      })
    })
  }

  isExistId(id){
    return document.getElementById(id) != null;
  }

  /**
   * 画面の再読み込みをします。
   * 
   * afterMsgObj -> {appのメッセージ系(ダイアログ/インスタントメッセージ)}
   * 
   * @param {*} url 
   * @param {*} afterMsgObj 
   */
  refresh(afterMsgObj){

    // cookieにオブジェクトを格納する。
    window.sessionStorage.setItem(['refresh_event'],[JSON.stringify(afterMsgObj)]);
    
    // リロード
    location.reload()
  }

  /**
   * urlのパラメーターをJSON形式で取得します。
   */
  getUrlParam(url = location.search){
    // デコードする。
    url = decodeURIComponent(url);
    return _chain(url).replace('?', '').split('&').map(_partial(_split, _, '=', 2)).fromPairs().value();
  }

  // モーダルスクロールをリセットにする
  modalScrollReset(){
    $("#modal-close").scrollTop(0);
  }

  // bodyのスクロールを
  scrollReset(){
    $("body").scrollTop(0);
  }

  // 画像のリサイズ
  imageResize({file_obj, dataURL, max_w, max_h, callback}){
    // ローディング
    this.onShowProgress();
    let base64Url = file_obj ? URL.createObjectURL(file_obj) : dataURL ? dataURL : "";

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const that = this;

    img.crossOrigin = "Anonymous";
    img.onload = function(e) {
      let isResize = false;
      let type = null;

      if(this.width > this.height){ // 横長
        if(this.width > max_w) [isResize, type] = [true, "W"]; 
      }
      else{ // 縦長
        if(this.height > max_h) [isResize, type] = [true, "H"]; 
      }

      const scale = isResize ? Math.round(((type === "W" ? max_w/this.width : max_h/this.height)*100)) / 100 : 1;
      const dstWidth = this.width * scale;
      const dstHeight = this.height * scale;
      canvas.width = dstWidth;
      canvas.height = dstHeight;
      ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, dstWidth, dstHeight);
      if(canvas.msToBlob){
        var blob = canvas.msToBlob();
        callback(blob);
      }else{
        canvas.toBlob(callback, "image/jpeg", 0.8);
      }
      
      that.onHideProgress();
    }
    img.src = base64Url;
  }
}

/**
 * ページ単位に分割したjsファイルのコンテンツオブジェクトを取得します。
 *
 * @param {*} cntId contentId
 * @memberof myApp
 */
function getContent(app){
  // 実際のcntIdと違うものはswitchで変換します。
  let contenId = "";
  switch (app.config.cntid){
    case "recruitToday":
      contenId = "recruit";
      break;
    case "error":
      errProc();
      break;
    default:
      contenId = app.config.cntid;
  }
  if(contents[contenId]) {
    const cnt = new contents[contenId]();
    cnt.app = app;
    return cnt;
  } 
  return false;
}

function errProc(){
  // URLをerrorに書きかけ
  history.replaceState('','','/error');
}