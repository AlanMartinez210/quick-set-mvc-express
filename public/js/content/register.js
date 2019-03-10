export default class register {
	constructor () {
		this.registerForm = $("[name=registerForm]");
		this.loginForm = $("[name=loginForm]");
	}
	ready(){
		const doRegisterBtn = this.registerForm.find("[name=doRegist]");
		const doLoginBtn = this.loginForm.find('[name=doLogin]');
		const loginBtn = $("#loginBtn");
		const introductionBtn = $("#introductionBtn");

		const pmh = 58;

		// 新規登録画面ヘッダー画像
		this.registerHeaderDefine(pmh);

		$(window).on('resize', ()=>{
			this.registerHeaderDefine(pmh);
		});

		loginBtn.on('click', {
			type: "login",
			onOpenBrefore: () => {
				this.loginForm.clearForm();
			}
		}, e => this.app.showModal(e));

		introductionBtn.on('click', {
			type: "introduction"
		}, e => this.app.showModal(e));

		doRegisterBtn.on('click', (e)=>{
			return this.regist(e);
		});
		doLoginBtn.on('click', (e)=>{
			return this.login(e);
		});
	}
	registerHeaderDefine(margin){
		$("#register_bg_i_size").height($(window).height() - ((margin/2) + 16));
		$(".register-ptn").find(".main-cntnr").css({
			marginTop: `-${(margin / 2)}px`
		});
	}
	/**
	 * 新規登録処理を行う。
	 *
	 * @param {*} e
	 */
	regist(e){
		const data = {
			user_name: this.registerForm.find('[name=user_name]').val(),
			password: this.registerForm.find('[name=password]').val(),
			email: this.registerForm.find('[name=email]').val(),
			user_type: this.registerForm.find('[name=user_type]:checked').val()
		}

		// 登録確認用ダイアログを表示する。
		this.app.showWarnDialog({
			name: "confRegister",
			title: "ユーザータイプの確認",
			text: `
				<p>選択したユーザータイプは<br />
				「<span class="c-red">${data.user_type == 1 ? "コスプレイヤー" : "カメラマン"}</span>」<br />
				でお間違いないですか？</p>
				<br />
				<p class="c-red">※作成後にユーザータイプは変えることが出来ません。</p>
			`,
		}).closelabel("新規登録へ戻る")
		.addBtn({
			callback: () => {
				this.app.sendPost('/api/register', data)
				.done(() => {
					// 新規登録モードをセッションに保持する。
					window.sessionStorage.setItem(['access_mode'],['register']);
					location.href = '/mypage';
				})
			}
		})

		return false;
	}
	/**
	 * ログイン処理を行う。
	 *
	 * @param {*} e
	 */
	login(e){
		const data = {
			login_key: this.loginForm.find('[name=login_key]').val(),
			login_password: this.loginForm.find('[name=login_password]').val()
		}
		this.app.sendPost('/api/login', data)
		.done(() => {
			this.app.plugin.sessionMsg.setAccessMode('login');
			location.href = '/mypage';
		})
		return false;
	}
}
