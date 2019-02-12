export default class costume{
	constructor(app){
		this.app = app;
		this.costumeList = [];
		this.$input_costume = $("#costumes");
		this.$costume_field = $("#costume_field");
		this.costume_delete_button = ".costume_delete_button";
		this.limitCostumeLength = 5;
		this.errEmitter = (errText) => {
			this.app.showInputErr("costume_field", errText);
			return false;
		}
	}
	init(){
		this.costumeList = [];
		return this;
	}
	ready(){

		// 所持コスプレの追加
		this.$input_costume.off('change');
		this.$input_costume.on('change', () => {
			const costume_id = $("#costumes option:selected").val();
			// 初期空白時に処理を飛ばす
			if(!costume_id) return false;

			if(!this.checkDuplicate(costume_id)){
				this.initSelect();
				return false;
			}
			if(!this.checkCostumeNum()){
				this.initSelect();
				return false;
			} 

			this.app.clearInputMsg("costume_field");

			const costume_name = $("#costumes option:selected").text();
			this.addCostume(costume_id, costume_name);
			this.initSelect();
		});

		// 所持コスプレ削除
		const that = this;
		this.$costume_field.off('click', this.costume_delete_button);
		this.$costume_field.on('click', this.costume_delete_button, function(){
			var costume_id = $(this).parent().children("input").val();
			$(this).parent().remove();
			
			var idx = that.costumeList.indexOf(Number(costume_id));
			if(idx >= 0){
				that.costumeList.splice(idx, 1);
			}
			// エラー表示を消す
			that.app.clearInputMsg("costume_field");
		});

	}

	/**
	 * 都道府県を追加する。
	 * @param {*} prefectureStr 
	 */
	addCostume(costume_id, costume_name){
		this.$costume_field.append(`
			<div class="tag-label flex _c">
				<span class="tag-text">${costume_name}</span>
				<i data-id="tab-close" class="far fa-times-circle costume_delete_button" ></i>
				<input type="hidden" value="${costume_id}">
				</div>
		`);

		this.costumeList.push(Number(costume_id));
	}

	/**
	 * 重複チェック
	 */
	checkDuplicate(costume_id){
		const idx = this.costumeList.indexOf(Number(costume_id));
		if(idx >= 0) return this.errEmitter(`すでに登録されています`);
		
		return true;
	}

	/**
	 * 個数チェック
	 */
	checkCostumeNum(){
		if((this.costumeList.length+1) > this.limitCostumeLength) return this.errEmitter(`活動地域は${this.limitCostumeLength}以上設定できません`);
		return true;
	}

	/**
	 * 選択を初期化する。
	 */
	initSelect(){
		$("#costumes").val("");
	}

	getCostumeValue(){
		return $('[name=costume_field]').find("input").map((idx, ele) => {
			return ele.value;
		}).get();
	}
}