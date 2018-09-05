export default class register {
	constructor () {
		this.registerForm = $("[name=registerForm]");
		this.loginForm = $("[name=loginForm]");
	}
	ready(){
		const doRegisterBtn = this.registerForm.find("[name=doRegist]");
		const doLoginBtn = this.loginForm.find('[name=doLogin]');
		const loginBtn = $("#loginBtn");

		const pmh = 58;

		// 新規登録画面ヘッダー画像
		this.registerHeaderDefine(pmh);

		$(window).on('resize', ()=>{
			this.registerHeaderDefine(pmh);
		});

		loginBtn.on('click', {type: "login"}, c2.showModal);

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
		console.log(this);
		const data = {
			user_name: this.registerForm.find('[name=user_name]').val(),
			password: this.registerForm.find('[name=password]').val(),
			email: this.registerForm.find('[name=email]').val(),
			user_type: this.registerForm.find('[name=user_type]').val(),
		}
		c2.sendPost('/api/register', data)
		.done(() => {
			location.href = '/mypage';
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
			userid: this.loginForm.find('[name=userid]').val(),
			password: this.loginForm.find('[name=password]').val()
		}
		c2.sendPost('/api/login', data)
		.done(() => {
			location.href = '/mypage';
		})
		return false;
	}
}
