// 画面操作系処理JS

export default () => {

	// メッセージチャットアクセス時のみ、bodyのスクロールを消す。
	const $mainFrame = $('.wrap-body-content');
	if($mainFrame.hasClass("message-ptn")){
		$("body").css({"overflow": "hidden"});
		$(".center-frame").scrollTop($(".center-frame")[0].scrollHeight);
	}
	$("#messageSendBtn").on("click", function(){
		$(".center-frame").animate({
			scrollTop: $(".center-frame")[0].scrollHeight
		}, "fast", "swing");
	});
	
	// スクロール時にヘッダーを一時的に非表示にする。
	const menuHeight = $(".hdr-menu").height();
	let startPos = 0;
	$(window).scroll(function(){
		const currentPos = $(window).scrollTop();
		if(Math.abs(currentPos - startPos) > 50){
			if (currentPos > startPos) {
				if($(window).scrollTop() >= 100) {
					$(".hdr-menu").css("top", "-" + 100 + "px");
				}
			} else {
				$(".hdr-menu").css("top", 0 + "px");
			}
			startPos = currentPos;
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