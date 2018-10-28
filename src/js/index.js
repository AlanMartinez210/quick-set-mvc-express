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
	setDesignPtn(bodyConfig.cntid);

	// ヘッダーの選択設定
	setHeaderSelect(bodyConfig.cntid);

	// コンテンツIDで指定されたコンテンツを実行します。
	const cnt = getContent(bodyConfig.cntid);
	if(cnt) cnt.ready();

	c2.plugin.screen();
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
  
	// $("#scMenu").on("change", function(){
	// 	const local = $(this).val();
	// 	window.location.href = local;
	// });

	// $("#searchBtn").on('click', function(){
	// 	console.log(window.innerWidth - document.body.clientWidth);
	// 	$(".wrapper").css({
	// 		"paddingRight": (window.innerWidth - document.body.clientWidth) + "px"
	// 	})
	// 	$("body").addClass("on-modal");
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

// c2.showRequestModal = (schedule_id)=>{
// 	c2.showDialog('PostCheck').yes(()=>{
// 		c2.onShowProgress();
// 		c2.sendPost('/mypage/matching/request', {schedule_id})
// 		.done(result=>{
// 			c2.showClearAll();
// 			c2.showMessage({type:"info", messageStr: "依頼を送信しました。"});
// 		})
// 		.always(result=>{c2.onHideProgress()});

// 		c2.hideDialog();
// 	}).no(()=>{
// 		c2.hideDialog();
// 	});
// };

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
  $(".wrap-body-content").addClass(`${designPtn}-ptn`);
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
