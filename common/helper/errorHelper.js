const messageHelper = require('./messageHelper');

/**
	 * ErrorHelperクラス
	 * 
	 * このオブジェクトはjavascript標準Errorオブジェクトを継承した
	 * カスタムエラーオブジェクトです。
	 * 
	 * 詳細はMDNのErrorオブジェクトについて
	 * また、独自エラーオブジェクトの定義方法を参照してください。
	 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error
	 * 
	 */
module.exports = class ErrorHelper extends Error {
	
	/**
	 * @param {*} param0 {object}
	 * err: このプロパティにErrorオブジェクトが渡された場合ErrorHelperオブジェクトとして再定義されます。
	 * window_msg: new Error("メッセージ") と同じ定義です。
	 * code: HTTPステータスを設定します。
	 * redirect_to: エラーハンドラーに渡された際に遷移する場所を指定します。
	 * logout: エラーハンドラーに渡された際にログアウト処理を行うか指定します。
	 */
	constructor({err = {}, code = "fatal", status = 500, redirect_to = "", logout = false } = {}){
		
		// 以下のコードの時はメッセージを固定する。
		switch(Number(status)){
			case 401:
			case 403:
				code = "L00001";
				break;
			case 404:
				code = "E00017";
				break;
		}

		// 親のErrorオブジェクトを生成します。
		super(messageHelper.getMsgObj(code).msg);
		// デフォルトのHTTPステータスを設定します。
		this.status = status;
		this.name = "ErrorHelper";

		// 渡されたErrorオブジェクトの一部を適応する
		if(err instanceof Error){
			this.message = err.message;
			this.status = err.status || status; // なければデフォルトで初期化
			this.stack = err.stack;
		}
		
		// 独自プロパティ
		this.window_msg = this.message;
		this.redirect_to = redirect_to;
		this.logout = logout;
		this.error_data = [];
	}

	/**
	 * error_dataを追加する
	 *
	 * @param
	 *   {object}
	 *     {code} のプロパティは必須
	 */
	addErrorData({ view_id = "window", code = "E00000" } = {}) {
		const msg = messageHelper.getMsgObj(code).msg;
		this.error_data.push({
			view_id: view_id,
			err_code: code,
			err_message: msg
		});
		return this;
	}
}