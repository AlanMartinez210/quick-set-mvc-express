export default class prefecture{
	constructor(){
		this.prefectureList = [];
		this.$Prefectures = $(".js-addPrefectures");
		this.$prefectures_field = $("#prefectures_field");
		this.tag_delete_button = ".tag_delete_button";
		this.limitPrefectureLength = 47;
		this.errEmitter = (errText) => {
			c2.showInputErr("prefectures_field", errText);
			return false;
		}
	}
	init(){
		this.prefectureList = [];
		return this;
	}
	ready(){

		// 都道府県タグ追加
		this.$Prefectures.off('change');
		this.$Prefectures.on('change', () => {
			const pref_id = $("#prefectures option:selected").val();
			// 初期空白時に処理を飛ばす
			if(!pref_id) return false;

			if(!this.checkDuplicate(pref_id)){
				this.initSelect();
				return false;
			}
			if(!this.checkPrefecturesNum()){
				this.initSelect();
				return false;
			} 

			c2.clearInputMsg("prefectures_field");

			const pref_name = $("#prefectures option:selected").text();
			this.addPrefecture(pref_id, pref_name);
			this.initSelect();
		});

		// 都道府県タグ削除
		const that = this;
		this.$prefectures_field.off('click', this.tag_delete_button);
		this.$prefectures_field.on('click', this.tag_delete_button, function(){
			// 削除する活動地域名取得
			var pref_id = $(this).parent().children("input").val();
			// 削除
			$(this).parent().remove();
			var idx = that.prefectureList.indexOf(pref_id);
			if(idx >= 0){
				that.prefectureList.splice(idx, 1);
			}
			// エラー表示を消す
			c2.clearInputMsg("prefectureField");
		});

	}

	/**
	 * 都道府県を追加する。
	 * @param {*} prefectureStr 
	 */
	addPrefecture(pref_id, pref_name){
		this.$prefectures_field.append(`
			<div class="tag-label flex _c">
				<span class="tag-text">${pref_name}</span>
				<i data-id="tab-close" class="far fa-times-circle tag_delete_button" ></i>
				<input type="hidden" value="${pref_id}">
				</div>
		`);

		this.prefectureList.push(pref_id);
	}

	/**
	 * 重複チェック
	 */
	checkDuplicate(pref_id){
		const idx = this.prefectureList.indexOf(pref_id);
		if(idx >= 0) return this.errEmitter(`すでに登録されています`);
		
		return true;
	}

	/**
	 * 個数チェック
	 */
	checkPrefecturesNum(){
		if((this.prefectureList.length+1) > this.limitPrefectureLength) return this.errEmitter(`活動地域は${this.limitPrefectureLength}以上設定できません`);
		return true;
	}

	/**
	 * 選択を初期化する。
	 */
	initSelect(){
		$("#prefectures").val("");
	}

	getPrefectureValue(){
		return $('[name=prefectures_field]').find("input").map((idx, ele) => {
			return ele.value;
		}).get();
	}
}