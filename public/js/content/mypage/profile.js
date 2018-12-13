import plugin_tag from "../../plugin/tag";
import plugin_prefecture from "../../plugin/prefecture";

export default class profile{
	constructor(){
		this.profileForm = $("[name=profileForm]");
		this.userDeleteForm = $("[name=userDeleteForm]");
		this.tags = new plugin_tag();
		this.prefs = new plugin_prefecture();
	}
	ready(){
		const doUserDeleteBtn = this.userDeleteForm.find('[name=doUserDelete]');
		const deleteBtn = $("#deleteBtn");
		const $userUpdateBtn = $("doUserUpdate");
		const consentDelete = this.userDeleteForm.find("#consentDelete");

		// タグと都道府県のプラグインをロード
		this.tags.init().ready();
		this.prefs.init().ready();

		// ユーザー情報の取得
		const user_id = $("[name=user_id]").val();
		c2.sendGet(`/mypege/profile/${user_id}`)
		.then(res => {
			res.prefectures.forEach(item => this.prefs.addPrefecture(item.pref_id, item.pref_name));
			this.profileForm.setValue(res);
		})
		
		// アカウント削除ボタン
		deleteBtn.on('click', {type: "delete"}, c2.showModal);
		doUserDeleteBtn.on('click', e => {
			if(consentDelete.prop('checked')){
				return this.userDelete(e);
			}
			else{
				c2.showInputErr("consent_delete", "チェックを入れてください。");
				return false;
			}
		});

		// ユーザー情報の更新
		$userUpdateBtn.on("click", () => {
			
		});
	}

	/**
	 * ユーザーのアカウントを削除します。
	 */
	userDelete(e){
		const data = {
			consent_delete: this.userDeleteForm.find('[name=consent_delete]').val(),
			password: this.userDeleteForm.find('[name=password]').val()
		}
		c2.sendPost('/api/delete', data)
		.done(() => {
			location.href = '/register';
		})
		return false;
	}
}