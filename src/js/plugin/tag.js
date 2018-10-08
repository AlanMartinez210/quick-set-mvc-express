export default class tag{
	constructor(){
		this.$input_tag = $("#tags");
		this.$tag_field = $("#tags_field");
		this.$tag_add_button = $("#tag_add_button");
		this.tagCount = 0;
		this.taglist = new Array();
		this.errText = "";
		this.limitTagLength = 10;
		this.errEmitter = () => {
			c2.showInputErr("box_tagField", this.errText);
			return false;
		}
	}
	ready(){
		
		this.$tag_add_button.on('click', () => {

		})



	}
	/**
	 * タグを追加する。
	 * @param {*} tagArr 
	 */
	addTags(tagArr){

	}
	/**
	 * 重複チェック
	 */
	checkDuplicate(){
		const idx = this.tagList.indexOf(this.$input_tag.val());
		if(idx >= 0){
			this.errText = "すでに登録されています";
			this.errEmitter();
		}
	}

	/**
	 * 空白チェック
	 */
	checkBlank(){
		if(this.$input_tag.val() == ""){
			this.errText = "すでに登録されています";
			this.errEmitter();
		}
	}

	/**
	 * 文字種チェック
	 */
	checkStrType(){
		if(this.$input_tag.val().match(/[<>]/)){
			this.errText = "使用できない文字が含まれています";
			this.errEmitter();
		}
	}
	
	/**
	 * タグの個数チェック
	 */
	checkTagsNum(){
		if(this.tagCount + 1 > this.limitTagLength){
			errText = `タグは${this.limitTagLength}以上設定できません。`;
			this.errEmitter();
		}
	}
	
}
//  () => {
// 	var tagCount = 0;
// 	var tagList = new Array();
	
// 	$("#tag_add_button").on('click', function(){

// 		var addTagName = $("#tags").val();


// 		// 前後に含まれるスペースを削除
// 		var addTagName = addTagName.replace(/^\s+|\s+$/g, "");

// 		// スペースのみの場合と、既にタグを10個登録している場合は処理しない
		
// 		let errText = "", errFlg = false;


// 		// 重複チェック
// 		var idx = tagList.indexOf(addTagName);
// 		if(idx >= 0){
// 			errText = "すでに登録されています";
// 			errFlg = true;
// 		}


// 		// 空チェック
// 		if(addTagName == ""){
// 			errText = "文字を入力してください。";
// 			errFlg = true;
// 		}


// 		// 文字種チェック
// 		if(addTagName.match(/[<>]/)){
// 			errText = "使用できない文字が含まれています";
// 			errFlg = true;
// 		}



// 		// 個数チェック
// 		const limitTagLength = 10; 
// 		if(!errFlg && tagCount + 1 > limitTagLength){
// 			errText = `タグは${limitTagLength}以上設定できません。`;
// 			errFlg = true;
// 		}



// 		// 
// 		if(errFlg){
// 			c2.showInputErr(box_tagField, errText);
//   		// inputにフォーカスを当てる
// 	  	$("#tags").focus();
// 			return false;
// 		}else{
// 			c2.clearInputMsg();
// 		}

// 		$("#tags_field").append(`
// 			<div class="tag-label flex _c">
// 				<span class="tag-text">#${addTagName}</span>
// 				<i data-id="tab-close" class="far fa-times-circle tag_delete_button" ></i>
// 				<input type="hidden" name="tags" value="${addTagName}">
// 			</div>
// 		`);
		
// 		// inputを空にする
// 		$("#tags").val("");
// 		// inputにフォーカスを当てる
// 		$("#tags").focus();
// 		tagCount++;
// 		tagList.push(addTagName);
// 	});

// 	//タグ削除
// 	$("#tags_field").on('click', ".tag_delete_button", function(){
// 		// 削除するタグ名取得(1文字目の#を削除)
// 		var deleteTagName = $(this).parent().children("span").first().text().slice(1);
// 		// 削除
// 		$(this).parent().remove();
// 		tagCount--;
// 		var idx = tagList.indexOf(deleteTagName);
// 		if(idx >= 0){
// 			tagList.splice(idx, 1); 
// 		}
// 		// エラー表示を消す
// 		$('#box_tagField').removeClass('error-input');
// 		$('#box_tagField .bottom-label').text("");
// 	});

// 	$("#tags").autocomplete({
// 		source: function( req, res ) {
// 			$.ajax({
// 					url: "../tags/search/" + encodeURIComponent(req.term),
// 					dataType: "json",
// 					success: function( data ) {
// 							res(data);
// 					}
// 			});
// 		},
// 		autoFocus: true,
// 		delay: 500,
// 		minLength: 2
// 	});

// 	$("#tags").on("keydown", function(e) {
// 		if ((e.which && e.which === 13) ||
//         (e.keyCode && e.keyCode === 13)) {
// 				$("#tag_add_button").trigger("click");
//       return false;
//     } else {
//       return true;
//     }
// 	});


// }