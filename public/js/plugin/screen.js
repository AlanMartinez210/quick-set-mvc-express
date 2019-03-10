// 画面操作系処理JS
export default class screen{
	constructor(){
		this.$mainFrame = $('.wrap-body-content');
		this.startPos = 0;
		this.scrollTimer = null;
		this.currentPos = 0;
	}
	ready(){
		const $hdrMenu = $(".hdr-menu");
		const $window = $(window);
		let ticking = false;

		const hdrMenuScroll = () => {
			if(!ticking){
				requestAnimationFrame(() => {
					ticking = false;
					this.currentPos = $window.scrollTop();
					
					if(this.currentPos >= 60){
						if((this.currentPos - this.startPos) > 0){
							$hdrMenu.css("top", "-" + 100 + "px");
						}else{
							if(Math.abs(this.currentPos - this.startPos) < 400) return false;
							$hdrMenu.css("top", 0 + "px");
						}
					}else{
						$hdrMenu.css("top", 0 + "px");
					}

					// スタートの更新
					this.startPos = this.currentPos;
				});
				ticking = true;
			}
		}

		document.addEventListener('scroll', hdrMenuScroll, {passive: false});

			// this.scrollTimer = setTimeout(() => {
			// 	this.currentPos = $window.scrollTop();
			// 	console.log('startPos: ', this.startPos );
			// 	console.log('currentPos: ', this.currentPos);
			// 	// 現在のポジションが100px以下ならメニューは初期値
			// 	if(this.currentPos <= 50){
			// 		$hdrMenu.css("top", 0 + "px");
			// 		return false;
			// 	}

			// 	// 下にスクロールした
			// 	if (this.currentPos > this.startPos) {
			// 		$hdrMenu.css("top", "-" + 100 + "px");
			// 	}
			// 	else {
			// 		if((this.startPos - this.currentPos >= 100)){
			// 			$hdrMenu.css("top", 0 + "px");
			// 		}
			// 	}

			// 	// スタートの更新
			// 	this.startPos = this.currentPos;

			// }, 33)

		// アコーディオンの開閉イベント
		$(".accordion-label").on("click", function(e){
			const acCnt = $(this).parent();
			if(acCnt.hasClass("on-show-acd-inner")){
				acCnt.removeClass("on-show-acd-inner");
			}else{
				acCnt.addClass("on-show-acd-inner");
			}
		})

		// ボードラベル用アコーディオンの開閉イベント
		$(".board-accordion").find(".board-hdr").on("click", function(e){
			const acCnt = $(this).parent();
			if(acCnt.hasClass("on-show-acd")){
				acCnt.removeClass("on-show-acd");
			}else{
				acCnt.addClass("on-show-acd");
			}
		})

		// タブメニューの選択イベント
		$(".tab-board").on("click", ".board-hdr .tab-item", e => {
			$(".tab-board .tab-item").removeClass("active-tab");
			$('[data-tab_content]').hide();
			$(e.currentTarget).addClass("active-tab");
			const tab_id = $(e.currentTarget).data("tab_id");
			$(`[data-tab_content="${tab_id}"]`).show();
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

	tabInit(){
		$(".tab-board .tab-item:first-child").trigger("click");
	}
}
