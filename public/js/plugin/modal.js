// モーダル関係の処理js

export default () => {
	var showModal = c2.showModal;
	var showClearAll = c2.showClearAll;
	const showModalNameObj = {
		".editReview": "editReview",
	}
	
	//show
	Object.keys(showModalNameObj).forEach(IdOrClass => {
		$(IdOrClass).on('click', {type: showModalNameObj[IdOrClass]}, showModal);
	});

	// other menu
	$("#editerMenuBtn").on('click', function(){
		const $m = $(".editer-menu");
		$m.hasClass("on-show") ? $m.removeClass("on-show") : $m.addClass("on-show");
	})
}
