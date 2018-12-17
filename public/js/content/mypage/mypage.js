export default class register {
	constructor(){
		this.logoutForm = $("[name=logoutForm]");
	}
	ready(){
		const doLogoutBtn = this.logoutForm.find('[name=doLogout]');
		const logoutBtn = $("#logoutBtn");

		this.app.plugin.screen.setContentBorder(36);

		logoutBtn.on('click', {type: "logout"}, e => this.app.showModal(e));

		doLogoutBtn.on('click', e => {
			return this.logout(e)
		})
	}

	/**
	 * ログアウト処理を行います。
	 */
	logout(e){
		this.app.sendPost('/api/logout', {})
		.done(() => {
			this.app.plugin.sessionMsg.setAccessMode('logout');
			location.href = '/register';
		})
		return false;
	}
}