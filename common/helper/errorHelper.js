const messageHelper = require('./messageHelper');

module.exports = class {
	/**
	 * エラーメッセージオブジェクト
	 *
	 * @param
	 *   {int} HTTPステータスコード
	 *
	 * @property
	 *   http_status HTTPステータスコード
	 *   error_data  エラーのオブジェクトデータ配列
	 *               要素にはcode, messageを必ず含める
	 *	 redirect_to  リダイレクト先
	*	 isHelper  errorHelperで作成されたエラーかどうか
	*/
	constructor({http_status = 500, window_msg = "", error_data = [], redirect_to = ""} = {}){
		this.http_status = http_status;
		this.window_msg = window_msg;
		this.error_data = error_data;
		this.redirect_to = redirect_to;
		this.isHelper = true;
	}

	/**
	 * this内のオブジェクトプロパティのみを取得する。
	 */
	get errObj(){
		return {
			http_status: this.http_status,
			error_data: this.error_data,
			redirect_to: this.redirect_to,
			window_msg: this.window_msg,
		};
	}

	/**
	 * error_dataを追加する
	 *
	 * @param
	 *   {object}
	 *     {code} のプロパティは必須
	 */
	addErrorData({view_id = "window", code = "E00000"}){
		const msg =	messageHelper.getMsgObj(code).msg;
		this.error_data.push({
			view_id: view_id,
			err_code: code,
			err_message: msg
		});
		return this;
	}

	/**
	 * 画面に表示する代表メッセージを設定する。
	 */
	setWindowMsg(code = "E00000"){
		this.window_msg = messageHelper.getMsgObj(code).msg;
		return this;
	}
}
