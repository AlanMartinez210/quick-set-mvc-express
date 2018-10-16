export default () => {
	let prefectureCount = 0;
	var prefectureList = new Array();
	$(".js-addPrefectures").on('change', function(){
		let prefectureValue = $('#prefectures option:selected').val();
		if (prefectureValue == "") {
			return false;
		}
		let prefectureName = $('#prefectures option:selected').text();
		const limitPrefectureLength = 47;
		let errText = "", errFlg = false;
		if(!errFlg && prefectureCount + 1 > limitPrefectureLength){
			errText = `活動地域は${limitPrefectureLength}個以上設定できません。`;
			errFlg = true;
		}
		// 重複チェック
		var idx = prefectureList.indexOf(prefectureName);
		if(idx >= 0){
			errText = "すでに登録されています";
			errFlg = true;
		}

		if(errFlg){
			$('#box_prefectureField').addClass('error-select-box');
			$('#box_prefectureField .bottom-label').text(errText);
			return false;
		}else{
			$('#box_prefectureField').removeClass('error-select-box');
      $('#box_prefectureField .bottom-label').text("");
		}

		$("#prefectures_field").append(`
			<div class="tag-label flex _c">
				<span class="tag-text">${prefectureName}</span>
				<i data-id="tab-close" class="far fa-times-circle tag_delete_button" ></i>
				<input type="hidden" name="prefectures" value="${prefectureValue}">
				</div>
		`);

		prefectureCount++;
		prefectureList.push(prefectureName);
	});

	//タグ削除
	$("#prefectures_field").on('click', ".tag_delete_button", function(){
		// 削除する活動地域名取得
		var deletePrefectureName = $(this).parent().children("span").first().text();
		// 削除
		$(this).parent().remove();
		prefectureCount--;
		var idx = prefectureList.indexOf(deletePrefectureName);
		if(idx >= 0){
			prefectureList.splice(idx, 1);
		}
		// エラー表示を消す
		$('#box_prefectureField').removeClass('error-select-box');
		$('#box_prefectureField .bottom-label').text("");
	});
}
