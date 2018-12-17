export default class tag{
	constructor(app){
		this.app = app;
		this.taglist = [];
		this.$input_tag = $("#tags");
		this.$tag_field = $("#tags_field");
		this.$tag_add_button = $("#tag_add_button");
		this.tag_delete_button = ".tag_delete_button";
		this.limitTagLength = 10;
		this.errEmitter = (errText) => {
			this.app.showInputErr("tag_field", errText);
			return false;
		}
	}
	init(){
		this.taglist = [];
		return this;
	}
	ready(){
		// タグ追加ボタン
		this.$tag_add_button.off('click');
		this.$tag_add_button.on('click', () => {
			this.app.clearInputMsg("tag_field");
			const tagStr = this.$input_tag.val();
			var addTagName = tagStr.replace(/^\s+|\s+$/g, "")
			if(!this.checkDuplicate(addTagName)) return false;
			if(!this.checkBlank(addTagName)) return false;
			if(!this.checkStrType(addTagName)) return false;
			if(!this.checkTagsNum()) return false;
			
			this.addTags(addTagName);
			this.clearTag();

			this.$input_tag.focus();
		})

		// タグを削除する。
		const that = this;
		this.$tag_field.off('off', this.tag_delete_button);
		this.$tag_field.on('click', this.tag_delete_button, function(){
			// 削除するタグ名取得(1文字目の#を削除)
			var deleteTagName = $(this).parent().children("span").first().text().slice(1);

			$(this).parent().remove();
			var idx = that.taglist.indexOf(deleteTagName);
			if(idx >= 0){
				that.taglist.splice(idx, 1); 
			}
			// エラー表示を消す
			that.app.clearInputMsg("tag_field");
		});
		
	}
	/**
	 * タグを追加する。
	 * @param {*} tagArr 
	 */
	addTags(tagArr){
		this.$tag_field.append(`
			<div class="tag-label flex _c">
				<span class="tag-text">#${tagArr}</span>
				<i data-id="tab-close" class="far fa-times-circle tag_delete_button" ></i>
				<input type="hidden" value="${tagArr}">
			</div>
		`);

		this.taglist.push(tagArr);
	}

	/**
	 * 重複チェック
	 */
	checkDuplicate(tagStr){
		const idx = this.taglist.indexOf(tagStr);
		if(idx >= 0) return this.errEmitter("すでに登録されています");
		return true;
	}

	/**
	 * 空白チェック
	 */
	checkBlank(tagStr){
		if(!tagStr) return this.errEmitter("文字を入力してください");
		return true;
	}

	/**
	 * 文字種チェック
	 */
	checkStrType(tagStr){
		if(tagStr.match(/[<>]/)) return this.errEmitter("使用できない文字が含まれています");
		return true;
	}

	/**
	 * タグの個数チェック
	 */
	checkTagsNum(){
		if( (this.taglist.length+1) > this.limitTagLength) return this.errEmitter(`タグは${this.limitTagLength}以上設定できません`);
		return true;
	}

	/**
	 * タグフィールドをクリアする。
	 */
	clearTag(){
		this.$input_tag.val("");
	}

	getTagValue(){
		return $('[name=tags_field]').find("input").map((idx, ele) => {
			return ele.value;
		}).get();
	}
}