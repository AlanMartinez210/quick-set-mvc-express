export default class message {
	ready(){
		const $messageSendBtn = $('#messageSendBtn');		// 送信ボタン
		const $messageTextArea = $('[name=message]');		// メッセージエリア
		const matching_id = parseInt(location.search.match(/[?&]r=(\d)/)[1]);
		$messageSendBtn.on('click', (event) => {
			this.app.sendPost("/api/room/postMessage", {
				matching_id: matching_id,
				message: $messageTextArea.text(),
			});
		})
	}
}
