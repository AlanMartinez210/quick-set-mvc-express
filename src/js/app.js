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
    console.log("** ajaxOption:")
    console.log(ajaxOption);
    return $.ajax(url, ajaxOption)
    .always(res => {console.log("always", res)})
    .fail(res => {
      const err_json = res.responseJSON;
      if(err_json){

        if(err_json.http_status === 500){

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

    // 非同期版
    if(e.data.onOpenBrefore){
      c2.onShowProgress(e);
      e.data.onOpenBrefore(e);
    }

    // 同期版
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
   * DialogIdで指定したダイアログの生成、表示を行います。
   *
   * @param {*} DialogId
   * @returns
   * @memberof myApp
   */
  showDialog(DialogId){
    // DialogIdからダイアログの内容定義を取得します。
    const dialogData = c2._getDialogDate(DialogId);
    const overlay = "<div id='dialog_overlay' class='ovarlay-dialog-wrap'></div>";

    // ダイアログタイトルHTML定義
    const dTitle = dialogData.title ? `
      <div class='dialog-title board-hdr'>
        <div class='label-box _fb flex _c'>
          ${dialogData.icon ? "<i class='icon-title-b " + dialogData.icon + " fa-fw'></i>" : ""}
          <span>${dialogData.title}</span>
        </div>
      </div>` : "";

    // ダイアログコンテンツHTML定義
    const dContent = dialogData.text ? `<div class='dialog-cnt board-cnt'>${dialogData.text}</div>` : "";

    // ダイアログフッターHTML定義
    const dFooter = dialogData.button ? `
      <div class='dialog-ftr  board-ftr'>
        ${dialogData.button.no ? `<button name='${dialogData.button.no.name}'>${dialogData.button.no.label}</button>` : ''}
        ${dialogData.button.yes ? `<button name='${dialogData.button.yes.name}'>${dialogData.button.yes.label}</button>` : ''}
      </div>` : "";

    // ダイアログをbodyの直前に定義します。
    $("body").prepend(`
      ${overlay}
      <div id='dialog_body' class='confirm-dialog-wrap' name='${dialogData.name}'>
        <div class='confirm-dialog board-prm'>
          ${dTitle}
          ${dContent}
          ${dFooter}
        </div>
			</div>
    `);

    // はい/いいえボタンのコールバックを定義
    var callbacks = {
      yes: (fnc)=>{
        $(`[name=${dialogData.name}] [name=${dialogData.button.yes.name}]`).click(fnc);
        return callbacks;
      },
      no : (fnc)=>{
        $(`[name=${dialogData.name}] [name=${dialogData.button.no.name}], #dialog_overlay`).click(fnc);
        return callbacks;
      },
    };
    return callbacks;
  }

  /**
   * ダイアログを非表示にします。
   *
   * @memberof myApp
   */
  hideDialog(){
    $('#dialog_overlay,#dialog_body').remove();
  }


  /**
   * ダイアログデータを定義します。
   *   - ダイアログはDialogIdをキーに取得します。
   *
   * @param {*} DialogId
   * @returns ダイアログデータ
   * @memberof myApp
   */
  _getDialogDate(DialogId, options = {}){
    const obj = {};
    switch(DialogId){
      // 投稿確認ダイアログ
      case "PostCheck":
        obj.icon = "fas fa-exclamation-circle c-orange";
        obj.name = "PostCheck";
        obj.title = "投稿確認";
        obj.text = "投稿します。よろしいですか";
        obj.button = {
          yes: {
            label:"はい",
            name:"doYes",
            onclick:()=>{console.log('yes')},
          },
          no: {
            label:"いいえ",
            name:"doNo",
            onclick:()=>{console.log('no')},
          }
        };
        break;
      case "deleteCheck":
        obj.icon = "fas fa-exclamation-circle c-orange";
        obj.name = "deleteCheck";
        obj.title = "削除確認";
        obj.text = "削除します。よろしいですか";
        obj.button = {
          yes: {
            label:"はい",
            name:"doYes",
            onclick:()=>{console.log('yes')},
          },
          no: {
            label:"いいえ",
            name:"doNo",
            onclick:()=>{console.log('no')},
          }
        };
        break;
    }

    return obj;
  }
}
