// モーダル関係の処理js

export default () => {
	var showModal = c2.showModal;
	var showClearAll = c2.showClearAll;
	const showModalNameObj = {
		"#searchBtn": "search",
		".createRecruit": "createRecruit",
		".createSchedule": "createSchedule",
		"#noticeBtn": "notice",
		".editReview": "editReview",
	}
	
	//show
	Object.keys(showModalNameObj).forEach(IdOrClass => {
		$(IdOrClass).on('click', {type: showModalNameObj[IdOrClass]}, showModal);
	});
	
	//close
	$("#modal-close").on('click',  showClearAll);
	$("#modal-close-btn").on('click', showClearAll);
	$(".modal-box").on('click', e=>{
		e.stopPropagation();
	});

	// other menu
	$("#editerMenuBtn").on('click', function(){
		const $m = $(".editer-menu");
		$m.hasClass("on-show") ? $m.removeClass("on-show") : $m.addClass("on-show");
	})
}
