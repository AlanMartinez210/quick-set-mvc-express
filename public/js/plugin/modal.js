// モーダル関係の処理js

export default () => {
	// other menu
	$("#editerMenuBtn").on('click', function(){
		const $m = $(".editer-menu");
		$m.hasClass("on-show") ? $m.removeClass("on-show") : $m.addClass("on-show");
	})
}
