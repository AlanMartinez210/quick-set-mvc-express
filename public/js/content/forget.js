export default class forget {
	constructor () {
    this.forgetForm = $("[name=forgetForm]");
	}
	ready(){

    // パスワードの再設定の送信ボタン
    $("[name=doSendforgetPassword]").on("click", e => {
      const sendData = this.forgetForm.getValue();

      this.app.showInfoDialog({
				mame: "confSend",
				title: "確認",
				text: `この内容で送信します。よろしいですか？<br /><br />はい、を押すとトップページへ移動します。`
			}).closelabel("いいえ")
			.addBtn({
				callback: () => {
          return this.app.sendPost(`/forget/password`, sendData);
				}
      })
      
      return false;
    })

    // アカウント復旧の送信ボタン
    $("[name=doSendforgetUserId]").on("click", e => {
      
    })
  }
}