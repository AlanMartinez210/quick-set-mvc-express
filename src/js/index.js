import myApp from './app';
import { contents } from './content/index';

const c2 = new myApp();
window.c2 = c2;

// init run function.
c2.init(() => {

});
// document read complated run function.
c2.ready(() => {
	// bodyのデータ属性を解析し、設定情報を取得する。
	const bodyConfig = c2.bodyParser();
  
	// デザインパターンの設定
	const ptn = setDesignPtn(bodyConfig.cntid);

	// ヘッダーの選択設定
	setHeaderSelect(bodyConfig.cntid);

	// コンテンツIDで指定されたコンテンツを実行します。
	const cnt = getContent(bodyConfig.cntid);
	if(cnt) cnt.ready();

  const screen = new c2.plugin.screen;
  screen.ready();
  c2.plugin.modal();

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
  $(".general-ptn").on("click", "#noticeBtn", {
    type: "notice",
    onSyncOpenBrefore : (resolve, reject, event) => {
      c2.sendGet(`/api/notice`, {}, {dataType: "html"})
      .done(result => {
        $("#noticeModal").html(result);
        resolve();
      });
    }
  }, c2.showModal)

  
	// $("#scMenu").on("change", function(){
	// 	const local = $(this).val();
	// 	window.location.href = local;
	// });


	// // 依頼するボタンの処理
	// $("[data-doRequest]").on('click',(e)=>{
	// 	var requestid = e.currentTarget.dataset.requestid;
	// 	c2.showRequestModal(requestid);
  // });
  
  // input系の標準イベント
  $("input[type='text'], input[type='password']").on('change', e => {
    c2.clearInputMsg(e.target.name);
  });

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
