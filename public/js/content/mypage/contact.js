export default class contact{
	constructor(){
		this.$contactForm = $("[name=contactForm]");
	}
	ready(){
		const doContactPostBtn = $("[name=doContactPost]");

		doContactPostBtn.on('click', e => this.sendContact(e));
	}

	//

	// 機材登録処理
	sendContact(e){
		const sendData = this.$contactForm.getValue();
		this.app.showInfoDialog({
			name: 'checkContactCmf',
			title: "送信の確認",
			text: "内容を送信します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				this.app.sendPost('/contact', sendData)
				.done(result => {
					this.app.refresh({showInfo: "処理が完了しました。"});
				})
			}
		})

		return false;
	}
}