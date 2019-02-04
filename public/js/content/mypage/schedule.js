import plugin_tag from "../../plugin/tag";
import plugin_prefecture from "../../plugin/prefecture";
import plugin_costume from "../../plugin/costume";
import outer_costume from "../mypage/costume";

export default class schedule{
	constructor(){
		this.scheduleForm = $('[name=scheduleForm]');
	}
	ready(){
		const scheduleSection = $('#scheduleSection');
		const calendarSection = $('#calendarSection');
		// 処理ボタン
		const doScheduleBtn = $('[name=doSchedulePost]');
		// モーダルの表示
		const openScheduleBtn = "[name=createSchedule]";
		const showScheduleBtn = "[name=showSchedule]";
		// 日付のみ表示のチェック
		const isExistSchedule = "#isCheckDate";
		
		//キャラクター追加ボタン
		const $addCharaBtn =  $("[name=addChara]");
		// あわせ募集に戻るボタン
		const $bkGroupBtn = $("[name=bk_group]");

		this.tags = new plugin_tag(this.app);
		this.prefs = new plugin_prefecture(this.app);
		this.p_costume = new plugin_costume(this.app);

		// 所持衣装の一部画面スクリプトを呼び出す。
		const costume = new outer_costume();
		costume.app = this.app;
		//costumeをスケジュールモードで開く
		costume.ready({type: "schedule"});

		// カレンダーの年を変更したとき
		calendarSection.on("change", "[name=yearSelectList]", (e) => {
			const year = $(e.target).val();
			const month = $(".month-btn-box")[0].dataset.select_month;
			this.getCalendarList(e, year, month);
		})

		/* カレンダーの月ボタンを押した時の処理 */
		calendarSection.on("click", "[name=selectMonthList]", (e) => {
			const year = e.currentTarget.dataset.selected_year;
			const month = e.currentTarget.dataset.selected_month;
			this.getCalendarList(e, year, month);
		});

		// モーダルを参照モードで開く
		scheduleSection.on('click', showScheduleBtn , {
			type: "createSchedule",
			onSyncOpenBrefore : (resolve, reject, event) => {
				this.openScheduleModal("reference", resolve, reject, event);
			}
		}, e => this.app.showModal(e));
		
		// モーダルを開く
		scheduleSection.on('click', openScheduleBtn , {
			type: "createSchedule",
			onSyncOpenBrefore : (resolve, reject, event) => {
				this.openScheduleModal("edit", resolve, reject, event);
			}
		}, e => this.app.showModal(e));

		// スケジュールが存在するもののみ表示
		scheduleSection.on('change', isExistSchedule, (e) => {
			if($("#"+e.target.id).prop("checked")){
				$(".empty").hide();
			}
			else{
				$(".date-list li").show();
			}
		});

		// 登録/編集/削除ボタンの処理
		doScheduleBtn.on('click', (event) => {
			let path = "/mypage/schedule";
			let httpMethod;
			const modal_mode = event.currentTarget.dataset.proc;
			const sendData = this.getModalData();
			let dialog = {};

			if(modal_mode === "delete"){
				httpMethod = "sendDelete";
				dialog = this.app.showWarnDialog({
					name: "checkDel",
					title: "削除の確認",
					text: "この内容を削除します。よろしいですか？"
				})
			}
			else{
				path = this.app.config.isCam() ? path + "/cam" : path + "/cos";
				httpMethod = modal_mode === "create" ? "sendPost" : "sendPut";
				dialog = this.app.showInfoDialog({
					name: "checkCmf",
					title: modal_mode === "create" ?  "登録の確認" : "更新の確認",
					text: modal_mode === "create" ?  "この内容で登録します。よろしいですか？" : "この内容で更新します。よろしいですか？",
				})
			}

			dialog.closelabel("いいえ")
			.addBtn({
				callback: () => {
					this.app[httpMethod](path, sendData)
					.done(result => {
						$('.month-label.seleced').click();
						this.app.hideDialog();
						this.app.showClearAll();
						this.app.showInfo("処理に成功しました。");
					})
				}
			})
	
			return false;
		});

		// キャラクター検索モーダルの切り替え
		$addCharaBtn.on("click", () => {
			this.app.switchModal("charaSearch");
		});

		// あわせ募集に戻る
		$bkGroupBtn.on("click", () => {
			this.app.switchModal("createSchedule");
		});

	}
	// スケジュールの取得
	getSchedule(schedule_id){
		return this.app.sendGet(`/mypage/schedule/${schedule_id}`);
	}

	// 指定年月のスケジュール一覧の取得。
	getCalendarList(e, year, month){
		this.app.sendGet(`/mypage/schedule/${year}/${month}`, {}, {dataType: "html"})
		.done(result=>{
			$('#calendarSection').html(result);
		})
	}

	// 変更無効時のモーダル制御
	modalDisable(){
		$(".proc-box").hide();
		this.scheduleForm.find("input").prop('readonly', true);
		this.scheduleForm.find("select").prop("readonly", true);
		this.scheduleForm.find("textarea").prop('readonly', true);
	}

	// 変更有効時のモーダル制御
	modalEnable(){
		$(".proc-box").show();
		this.scheduleForm.find("input").prop('readonly', false);
		this.scheduleForm.find("input[name=date_key]").prop('readonly', true);
		this.scheduleForm.find("textarea").prop('readonly', false);
	}

	getModalData(){
		const data = this.scheduleForm.getValue();

		// 都道府県の取得(カメラマン用)
		if(this.app.config.isCam())	data.prefectures_field = this.prefs.getPrefectureValue();
		
		//タグの取得
		data.tag_field = this.tags.getTagValue();
		return data;
	}

	openScheduleModal(openMode, resolve, reject, event){
		let modal_mode = "";
		this.app.plugin.screen.tabInit();

		// タグと都道府県のプラグインをロード
		this.tags.init().ready();
		this.prefs.init().ready();
		this.p_costume.init().ready();

		// formを初期化する 
		this.scheduleForm.clearForm();

		if(openMode === "reference"){
			modal_mode = openMode;
			this.modalDisable();
		}
		else{
			modal_mode = event.currentTarget.dataset.mode;
			this.modalEnable();
			// 対象ボタンの表示
			$(".proc-btn").hide();
			$(`[data-proc=${modal_mode}]`).show();
		}

		// 共通情報の取得
		// コスプレ情報
		if(this.app.config.isCos()){

		}

		switch(modal_mode){
			case "create":
				const date_key = event.currentTarget.dataset.date_key;
				this.scheduleForm.find('[name=date_key]').val(date_key);
				resolve();
				break;
			case "delete": // 削除モード
				this.modalDisable();
			case "reference": // 参照モード
			case "edit": // 編集モード
				const schedule_id = event.currentTarget.dataset.schedule_id;
				if(!schedule_id) reject();
				
				// 値を取りに行く
				this.getSchedule(schedule_id)
				.then(res => {
					// タグと都道府県のみ別設定
					res.tag_field.forEach(item => this.tags.addTags(item));
					res.prefectures_field.forEach(item => this.prefs.addPrefecture(item.prefecture_id, item.prefecture_name));
					this.scheduleForm.setValue(res);
					resolve();
				});
				
				break;
		}
	}
}
