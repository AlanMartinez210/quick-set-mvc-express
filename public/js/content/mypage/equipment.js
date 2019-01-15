export default class costume{
	constructor(){
		this.$equipmentSection = $('#equipmentSection');
		this.$equipmentForm = $('[name=equipmentForm]');
	}
	ready(){

		const $maker_type = $('[name=maker_type]');
		const $box_maker = $('#box_maker_name');
		const doPostEquipmentBtn = '[name=doPostEquipment]';

		// 機材種別の入力項目のコントロール
		$maker_type.on('change', (e) => {
			Number($(e.currentTarget).val()) === 99 ? $box_maker.show() : $box_maker.hide();
		})

		// 登録ボタン
		this.$equipmentSection.on('click', doPostEquipmentBtn, e => this.registEquipment(e));

	}

	//

	// 機材登録処理
	registEquipment(e){
		const sendData = this.$equipmentForm.getValue();
		this.app.showInfoDialog({
			name: 'checkTitleCmf',
			title: "登録の確認",
			text: "この内容で登録します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				this.app.sendPost('/mypage/equipment', sendData)
				.done(result => {
					this.app.hideDialog();
					this.app.showClearAll();
					this.app.showInfo("処理に成功しました。");
				})
			}
		})

		return false;
	}

}