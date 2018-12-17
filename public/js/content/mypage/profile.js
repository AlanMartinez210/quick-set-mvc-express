import plugin_tag from "../../plugin/tag";
import plugin_prefecture from "../../plugin/prefecture";

export default class profile{
	constructor(){
		this.profileForm = $("[name=profileForm]");
		this.userDeleteForm = $("[name=userDeleteForm]");
	}
	ready(){
		this.tags = new plugin_tag(this.app);
		this.prefs = new plugin_prefecture(this.app);

		const doUserDeleteBtn = this.userDeleteForm.find('[name=doUserDelete]');
		const deleteBtn = $("#deleteBtn");
		const $userUpdateBtn = $("[name=doUserUpdate]");
		const consentDelete = this.userDeleteForm.find("#consentDelete");
		const $editProfileIconBtn = $("[name=doEditProfileIcon]")

		// タグと都道府県のプラグインをロード
		this.tags.init().ready();
		this.prefs.init().ready();

		// ユーザー情報の取得
		const user_id = $("[name=user_id]").val();
		this.app.sendGet(`/mypage/profile/${user_id}`)
		.then(res => {
			console.log('res: ', res);
			this.profileForm.setValue(res);
			res.tags.forEach(item => this.tags.addTags(item.tag_name));
			res.prefectures.forEach(item => this.prefs.addPrefecture(item.pref_id, item.pref_name));
			
		})

		// ユーザー情報の更新
		$userUpdateBtn.on("click", () => {

			const sendData = this.profileForm.getValue();
			
			// 都道府県の取得(カメラマン用)
			sendData.prefectures_field = this.prefs.getPrefectureValue();
			//タグの取得
			sendData.tag_field = this.tags.getTagValue();

			this.app.showInfoDialog({
				name: "checkCmf",
				title: "更新の確認",
				text: "この内容で更新します。よろしいですか？",
			})
			.closelabel("いいえ")
			.addBtn({
				callback: () => {
					this.app.sendPost("/mypage/profile", sendData)
					.done(result => {
						this.app.refresh({showInfo: "処理が完了しました。"});
					})
				}
			});

			return false;

		});
		
		// アカウント削除ボタン
		deleteBtn.on('click', {type: "delete"}, e => this.app.showModal(e));
		doUserDeleteBtn.on('click', e => {
			if(consentDelete.prop('checked')){
				return this.userDelete(e);
			}
			else{
				this.app.showInputErr("consent_delete", "チェックを入れてください。");
				return false;
			}
		});

		$editProfileIconBtn.on('click', {type: 'editProfileIcon'}, e => this.app.showModal(e));
	}

	/**
	 * ユーザーのアカウントを削除します。
	 */
	userDelete(e){
		const data = {
			consent_delete: this.userDeleteForm.find('[name=consent_delete]').val(),
			password: this.userDeleteForm.find('[name=password]').val()
		}
		this.app.sendPost('/api/delete', data)
		.done(() => {
			this.app.plugin.sessionMsg.setAccessMode('proc_comp');
			location.href = '/register';
		})
		return false;
	}
}