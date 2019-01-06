// 画面操作系処理JS
export default class screen{
	constructor(){
		this.$window = $(window);
		this.$mainFrame = $('.wrap-body-content');
		this.startPos = 0;
	}
	ready(){
		// スクロール時にヘッダーを一時的に非表示にする。
		this.$window.scroll(() => {
			const currentPos = $(window).scrollTop();
			if(Math.abs(currentPos - this.startPos) > 50){
				if (currentPos > this.startPos) {
					if(currentPos >= 60) $(".hdr-menu").css("top", "-" + 100 + "px");
				}
				else {
					$(".hdr-menu").css("top", 0 + "px");
				}
				this.startPos = currentPos;
			}
		});

		// アコーディオンの開閉イベント
		$(".accordion-label").on("click", function(e){
			const acCnt = $(this).parent();
			if(acCnt.hasClass("on-show")){
				acCnt.removeClass("on-show");
			}else{
				acCnt.addClass("on-show");
			}
		})

		// ボードラベル用アコーディオンの開閉イベント
		$(".board-accordion").find(".board-hdr").on("click", function(e){
			const acCnt = $(this).parent();
			if(acCnt.hasClass("on-show")){
				acCnt.removeClass("on-show");
			}else{
				acCnt.addClass("on-show");
			}
		})

		// メッセージチャットアクセス時のみ、bodyのスクロールを消す。
		// if($mainFrame.hasClass("message-ptn")){
		// 	$("body").css({"overflow": "hidden"});
		// 	$(".center-frame").scrollTop($(".center-frame")[0].scrollHeight);
		// }

		// $("#messageSendBtn").on("click", function(){
		// 	$(".center-frame").animate({
		// 		scrollTop: $(".center-frame")[0].scrollHeight
		// 	}, "fast", "swing");
		// });


	}
	/**
	 * コンテンツボーダー(general-ptnのみ)
	 */
	setContentBorder(height){
		$(".general-ptn .main-cntnr").css("margin-top", -height);
		$(".general-ptn .hdr-cntnr").css("padding-bottom", height);
	}
}
