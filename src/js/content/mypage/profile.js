export default class profile{
	constructor(){
		this.profileForm = $("[name=profileForm]");
		this.userDeleteForm = $("[name=userDeleteForm]");
	}
	ready(){
		const doUserDeleteBtn = this.userDeleteForm.find('[name=doUserDelete]');
		const deleteBtn = $("#deleteBtn");
		const consentDelete = this.userDeleteForm.find("#consentDelete");
		
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