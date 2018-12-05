export default class register {
	constructor(){
		this.logoutForm = $("[name=logoutForm]");
	}
	ready(){
		const doLogoutBtn = this.logoutForm.find('[name=doLogout]');
		const logoutBtn = $("#logoutBtn");

		logoutBtn.on('click', {type: "logout"}, c2.showModal);

		doLogoutBtn.on('click', e => {
			return this.logout(e)
		})
	}

	/**
	 * ログアウト処理を行います。
	 */
	logout(e){
		c2.sendPost('/api/logout', {})
		.done(() => {
			window.sessionStorage.setItem(['access_mode'],['logout']);
			location.href = '/register';
		})
		return false;
	}
}