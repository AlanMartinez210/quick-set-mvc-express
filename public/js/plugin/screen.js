// 画面操作系処理JS
export default class screen{
	constructor(){
		this.$window = $(window);
		this.$mainFrame = $('.wrap-body-content');
		this.$generalHeaderMenu = $(".hdr-menu");
		this.startPos = 0;
	}
	ready(){

		// スクロール時にヘッダーを一時的に非表示にする。
		this.$window.scroll(() => {
			const currentPos = $(window).scrollTop();
			if(Math.abs(currentPos - this.startPos) > 50){
				if (currentPos > this.startPos) {
					if($(window).scrollTop() >= 100) this.$generalHeaderMenu.css("top", "-" + 100 + "px");
				}
				else {
					this.$generalHeaderMenu.css("top", 0 + "px");
				}
				this.startPos = currentPos;
			}
		});

			$(".accordion-label").on("click", function(e){
				const acCnt = $(this).parent();
				if(acCnt.hasClass("on-show")){
					acCnt.removeClass("on-show");
				}else{
					acCnt.addClass("on-show");
				}
			})

			$(".board-accordion").find(".board-hdr").on("click", function(e){
				const acCnt = $(this).parent();
				if(acCnt.hasClass("on-show")){
					acCnt.removeClass("on-show");
				}else{
					acCnt.addClass("on-show");
				}
			})

			const $head = $('.profile-ptn .hdr-cntnr');
			$head.height($head.width() * 0.38);

	}
}


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