import { baseApp } from './baseApp';
import { Plagins } from './plugin/index';

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
    this.plugin = Plagins;
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
    // index.jsの共通処理
    super.ready(fn);

    // 画面の表示
    super.ready(()=>{
      const $mainFrame = $('.wrap-body-content');
      $mainFrame.fadeIn("fast");
    });
  }

  /**
   *bodyのdata-*を取得する。
   *
   * @returns
   * @memberof myApp
   */
  bodyParser(){
    const bodyConfig = {};
    const body = document.getElementsByTagName('body')[0];
    bodyConfig.cntid = body.dataset.cntid;
    bodyConfig.usertype = body.dataset.usertype;
    return bodyConfig;
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

    c2.onShowProgress();

    const ajaxOption = {
      type: method,
      contentType: (option.contentType||'application/json'),
      dataType: (option.dataType||'json'),
      timeout : 30000,
      cache: false,
      header: {

      }
    }
    if(Object.keys(data).length > 0) Object.assign(ajaxOption, {data: JSON.stringify(data)});
      console.log(" -> send options: ", ajaxOption);
      return $.ajax(url, ajaxOption)
        .always(res => {
        c2.onHideProgress();
        console.log(" -> response params: ", res)
      })
      .fail(res => {
        const err_json = res.responseJSON;
        if(err_json){
          c2.hideDialog();
          if(err_json.http_status === 500 || err_json.http_status === 401){
            c2.showClearAll();
            /**
             * redirect_toの指定がある場合はエラーを判別せず
             * 画面遷移を行う。
             * そうでなければそのままエラーメッセージをインスタントメッセージ表示する。
             */
            if(err_json.redirect_to){
              location.href = error.redirect_to; 
            }
            else{
              c2.showErrMsg(err_json.window_msg);
            }
          }
          else{
            // 項目にエラーを反映する。
            const error_data = err_json.error_data;
            error_data.forEach(obj => {
              $(`#box_${obj.view_id}`).addClass('error-input').find(".bottom-label").text(obj.err_message);
            })
          }
      }
      else{
        // 万が一、err_Jsonがなければ致命エラー

        // TODO ログアウト処理
        // setTimeout(function(){
        //   location.href = "/register";
        // }, 3000)
        
        c2.showErrDialog({
          name: "fatalerr",
          title: "予期せぬエラー",
          text: "予期せぬエラーが発生しました。<br />※3秒後に自動ログアウトします。"
        })
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
    return this.sendAjax("post", url, data, option);
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
    return this.sendAjax("get", url, data, option);
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
    return this.sendAjax("delete", url, data, option);
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
      c2.onShowProgress(e);
      e.data.onOpenBrefore(e);
      c2.onHideProgress();
    }

    // 非同期版
    if(e.data.onSyncOpenBrefore){
      c2.onShowProgress();
      const preModalProc = new Promise((resolve, reject) => {
        return e.data.onSyncOpenBrefore(resolve, reject, e);
      });
      preModalProc
      .then(() => {
        c2.onHideProgress();
        $("#"+ e.data.type + "Modal").attr("data-modal", "show");
      })
      .catch(err => {
        c2.onHideProgress();
        c2.showClearAll();
        c2.showErrMsg("処理に失敗しました。改善しない場合は、一度ログアウトし、再度ログインしてお試しください。")
      })
    }
    else{
      $("#"+ e.data.type + "Modal").attr("data-modal", "show");
    }

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
        <span class="msg-close" onClick="c2.clearMessage();"><i class="fas fa-times"></span></i>
      </div>`;

    $("body").prepend(mesHtml);
    $("body").find(".instantMessage").animate({
      top: "8px",
      opacity: 1
    }, 300);

    setTimeout(()=>{
      c2.clearMessage();
    }, delay);

  }

  /**
   * インフォメーションインスタントメッセージを表示します。
   *
   * @param {*} msgStr
   * @memberof myApp
   */
  showInfo(msgStr){
    c2.showMessage({type: "info", messageStr: msgStr});
  }

  /**
   * 警告インスタントメッセージを表示します。
   *
   * @param {*} alertMsg
   * @memberof myApp
   */
  showAlert(alertMsg){
    c2.showMessage({type: "warn", messageStr: alertMsg});
  }

  /**
   * エラーインスタントメッセージを表示します。
   *
   * @param {*} alertMsg
   * @memberof myApp
   */
  showErrMsg(errMsg){
    c2.showMessage({type: "err", messageStr: errMsg});
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
    return c2._showDialog(name, title, text, "info");
  }

  /**
   * 警告用のダイアログを表示します。
   */
  showWarnDialog({name, title, text} = dialogObj){
    return c2._showDialog(name, title, text, "warn");
  }

  /**
   * エラー用のダイアログを表示します。
   */
  showErrDialog({name, title, text} = dialogObj){
    return c2._showDialog(name, title, text, "err");
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
    $closeBtn.on('click', c2.hideDialog);

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

  
}
