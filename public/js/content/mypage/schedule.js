import plugin_tag from "../../plugin/tag";
import plugin_prefecture from "../../plugin/prefecture";

export default class schedule{
	constructor(){
		this.scheduleForm = $('[name=scheduleForm]');
	}
	ready(){
		this.tags = new plugin_tag(this.app);
		this.prefs = new plugin_prefecture(this.app);

		const scheduleSection = $('#scheduleSection');
		const calendarSection = $('#calendarSection');
		// 処理ボタン
		const doScheduleBtn = $('[name=doSchedulePost]');
		// モーダルの表示
		const openScheduleBtn = "[name=createSchedule]";
		const showScheduleBtn = "[name=showSchedule]";
		// 日付のみ表示のチェック
		const isExistSchedule = "#isCheckDate";

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
				this.modalDisable();

				// タグと都道府県のプラグインをロード
				this.tags.init().ready();
				this.prefs.init().ready();

				// formを初期化する 
				this.scheduleForm.clearForm();

				// 操作ボタン非表示
				$(".proc-box").hide();

				const schedule_id = event.currentTarget.dataset.schedule_id;
				if(!schedule_id){
					reject();
				}
				else{
					// 値を取りに行く
					this.getSchedule(schedule_id)
					.then(res => {
						// タグと都道府県のみ別設定
						res.tag_field.forEach(item => this.tags.addTags(item));
						res.prefectures_field.forEach(item => this.prefs.addPrefecture(item.prefecture_id, item.prefecture_name));
						this.scheduleForm.setValue(res);
						resolve();
					});
				}
			}
		}, e => this.app.showModal(e));
		

		// モーダルを開く
		scheduleSection.on('click', openScheduleBtn , {
			type: "createSchedule",
			onSyncOpenBrefore : (resolve, reject, event) => {
				const modal_mode = event.currentTarget.dataset.mode;

				this.modalEnable();
				// タグと都道府県のプラグインをロード
				this.tags.init().ready();
				this.prefs.init().ready();

				// formを初期化する 
				this.scheduleForm.clearForm();

				// 一旦非表示
				$(".proc-btn").hide();
				// ボタンの表示
				$(".proc-box").show();
				$(`[data-proc=${modal_mode}]`).show();

				switch(modal_mode){
					case "create":
						const date_key = event.currentTarget.dataset.date_key;
						this.scheduleForm.find('[name=date_key]').val(date_key);
						resolve();
						break;
					case "delete": // 削除モード
						this.modalDisable();
					case "edit": // 編集モード
						const schedule_id = event.currentTarget.dataset.schedule_id;
						if(!schedule_id){
							reject();
						}
						else{
							// 値を取りに行く
							this.getSchedule(schedule_id)
							.then(res => {
								// タグと都道府県のみ別設定
								res.tag_field.forEach(item => this.tags.addTags(item));
								res.prefectures_field.forEach(item => this.prefs.addPrefecture(item.prefecture_id, item.prefecture_name));
								this.scheduleForm.setValue(res);
								resolve();
							});
						}
						break;
				}
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
				httpMethod = "sendPost";
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
		this.scheduleForm.find("input").prop('readonly', true);
		this.scheduleForm.find("select").prop("readonly", true);
		this.scheduleForm.find("textarea").prop('readonly', true);
		this.scheduleForm.find(".sub-label").hide();
	}

	// 変更有効時のモーダル制御
	modalEnable(){
		this.scheduleForm.find("input").prop('readonly', false);
		this.scheduleForm.find("input[name=date_key]").prop('readonly', true);
		this.scheduleForm.find("textarea").prop('readonly', false);
		this.scheduleForm.find(".sub-label").show();
	}

	getModalData(){
		const data = this.scheduleForm.getValue();

		// 都道府県の取得(カメラマン用)
		if(this.app.config.isCam()){
			data.prefectures_field = this.prefs.getPrefectureValue();
		}
		
		//タグの取得
		data.tag_field = this.tags.getTagValue();
		return data;
	}
}
