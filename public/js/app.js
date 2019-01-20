import { baseApp } from './baseApp';
import { Plagins } from './plugin/index';
import { contents } from './content/index';

import _ from 'lodash';

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
    _.forEach(Plagins, (plg, key) => {
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
      _.forEach(this.plugin, p => {
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
      _.forEach(this.plugin, p => {
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
    return _.isObject(body.dataset) ? Object.assign({}, body.dataset) : {};
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
      contentType: (option.contentType||'application/json'),
      dataType: (option.dataType||'json'),
      timeout : 30000,
      cache: false,
      header: {}
    }

    if(Object.keys(data).length > 0) Object.assign(ajaxOption, {data: JSON.stringify(data)});
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
        $("#"+ e.data.type + "Modal").attr("data-modal", "show");
      })
      .catch(err => {
        this.onHideProgress();
        this.showClearAll();
        this.showErrMsg("処理に失敗しました。改善しない場合は、一度ログアウトし、再度ログインしてお試しください。")
      })
    }
    else{
      $("#"+ e.data.type + "Modal").attr("data-modal", "show");
    }

    const modal_close_obj = $("#modal-close, #modal-close-btn");
    
    if(e.data.onCloseBrefore){  // 閉じる処理(同期)
      // 登録イベントを一旦破棄する。
      modal_close_obj.on('click', (ev) => {
        this.onShowProgress();
        e.data.onCloseBrefore(ev);
        this.onHideProgress();
        this.showClearAll();
      });
    }
    else if(e.data.onSyncCloseBrefore){ // 閉じる処理(非同期)
      modal_close_obj.on('click', (ev) => {
        this.onShowProgress();
        const preCloseProc = new Promise((resolve, reject) => {
          return e.data.onSyncCloseBrefore(resolve, reject, ev);
        })
        preCloseProc
        .then(() => {
          this.onHideProgress();
          this.showClearAll();
        })
        .catch(err => {
          this.onHideProgress();
          this.showClearAll();
          this.showErrMsg("処理に失敗しました。改善しない場合は、一度ログアウトし、再度ログインしてお試しください。");
        })
      });
    }
    else{
      modal_close_obj.on('click', this.showClearAll);
    }

    $(".modal-box").on('click', e => {
      e.stopPropagation();
    });

  	return false;
  };

  /**
   * すべてのモーダルを非表示にします。
   */
  showClearAll(){
  	$(".on-show").removeClass("on-show");
  	$(".wrapper").css({"paddingRight": "0px"});
  	$("body").removeClass("on-modal");
    $(".modal-box").find("[data-modal='show']").attr("data-modal", "hide");
    $("#modal-close, #modal-close-btn").off('click');
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
    let delay = (mesObj.messageStr.length / 6) * 1000;
    delay = delay < 3000 ? 3000 : delay;


    // メッセージの生成と表示
    const mesHtml = `
      <div class="instantMessage shadow-d">
        <p class="message-str msg-${mesObj.type}">${mesObj.messageStr}</p>
        <span class="msg-close"><i class="fas fa-times"></span></i>
      </div>`;

    // クリアメッセージの設定
    $("body").on('click',  ".msg-close", () => {
      this.clearMessage();
    })

    $("body").prepend(mesHtml);
    $("body").find(".instantMessage").animate({
      top: "8px",
      opacity: 1
    }, 300);

    setTimeout(()=>{
      this.clearMessage();
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
  clearMessage(){
    $("body").find(".instantMessage").animate({
      top: "0px",
      opacity: 0
    }, 300, () => {
      $("body").find(".instantMessage").remove();
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
        <div class='label-box _fb'>
          <p class='title-str dialog-${type}'>${title}</>
        </div>
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
    return _.chain(url).replace('?', '').split('&').map(_.partial(_.split, _, '=', 2)).fromPairs().value();
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