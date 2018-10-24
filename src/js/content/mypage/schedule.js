import plugin_tag from "../../plugin/tag";
import plugin_prefecture from "../../plugin/prefecture";

export default class schedule{
	constructor(){
		this.scheduleForm = $('[name=scheduleForm]');
		this.tag = new plugin_tag();
		this.prefecture = new plugin_prefecture();
	}
	ready(){
		const scheduleSection = $('#scheduleSection');
		const calendarSection = $('#calendarSection');
		// 処理ボタン
		const doScheduleBtn = $('[name=doSchedulePost]');
		// モーダルの表示
		const openScheduleBtn = "[name=createSchedule]";
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

		// モーダルを開く
		scheduleSection.on('click', openScheduleBtn , {
			type: "createSchedule",
			onSyncOpenBrefore : (resolve, reject, event) => {
				this.modalEnable();
				
				this.tag.ready();
				this.prefecture.ready();

				const modal_mode = event.currentTarget.dataset.mode;
				const schedule_id = event.currentTarget.dataset.schedule_id;
				const date_key = event.currentTarget.dataset.date_key;

				// 一旦非表示
				$(".proc-btn").hide();
				// ボタンの表示
				$(`[data-proc=${modal_mode}]`).show();

				// formを初期化する 
				this.scheduleForm.clearForm();

				// 作成かつ日付がない場合は新規作成モードにし、内容を初期化する。
				if(modal_mode == "create" && !schedule_id) resolve();

				this.scheduleForm.find('[name=date_key]').dateVal(date_key);

				switch(modal_mode){
					case "create":
						resolve();
						break;
					case "delete": // 削除モード
						this.modalDisable();
					case "edit": // 編集モード
						// 値を取りに行く
						this.getSchedule(schedule_id)
						.then(res => {
							// タグと都道府県のみ別設定
							res.tag_field.forEach(item => {
								this.tag.addTags(item);
							});
							res.prefectures_field.forEach(item => {
								this.prefecture.addPrefecture(item);
							});
							console.log("bind-data", res);
							this.scheduleForm.setValue(res);
							resolve();
						})
						break;
				}
			}
			
		}, c2.showModal);

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
			let data = this.getModalData();
			let dialog = {};

			if(modal_mode === "delete"){
				httpMethod = "sendDelete";
				dialog = c2.showWarnDialog({
					name: "checkDel",
					title: "削除の確認",
					text: "この内容を削除します。よろしいですか？"
				})	
			}
			else{
				path = c2.config.isCam() ? path + "/cam" : path + "/cos";
				httpMethod = "sendPost";
				dialog = c2.showInfoDialog({
					name: "checkCmf",
					title: modal_mode === "create" ?  "登録の確認" : "更新の確認",
					text: modal_mode === "create" ?  "この内容で登録します。よろしいですか？" : "この内容で更新します。よろしいですか？",
				})
			}

			dialog.closelabel("いいえ")
			.addBtn({
				callback: function() {
					c2.onShowProgress();
					c2[httpMethod](path, data)
					.always(result=>{
						c2.onHideProgress();
						c2.hideDialog();
					})
					.done(result => {
						$('.month-label.seleced').click();
						c2.showClearAll();
						c2.showInfo("処理に成功しました。")
					})
				}
			})
	
			return false;
		});
			
	}
	// スケジュールの取得
	getSchedule(schedule_id){
		return c2.sendGet(`/mypage/schedule/${schedule_id}`);
	}

	// 指定年月のスケジュール一覧の取得。
	getCalendarList(e, year, month){
		c2.onShowProgress();
		c2.sendGet(`/mypage/schedule/${year}/${month}`, {}, {dataType: "html"})
		.done(result=>{
			c2.onHideProgress();
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
		const data = {};
		// セレクト、インプット、テキストボックスの取得
		this.scheduleForm.find('input, select, textarea').each((idx, ele) => {
			const ele_name = ele.name;
			switch(ele_name){
				case "":
				case "prefectures":
					// 無視
					break;
				case "date_key":
					data[ele_name] = $(ele).dateVal();
					break;
				default:
					data[ele_name] = $(ele).val();
					break;
			}
		});

		// 都道府県の取得(カメラマン用)
		if(c2.config.isCam()){
			data.prefectures_field = $('[name=prefectures]').map((idx, ele) => {
				return ele.value;
			}).get();
		}
		
		//タグの取得
		data.tag_field = $('[name=tags]').map((idx, ele) => {
			return ele.value;
		}).get();

		console.log("send-data: ", data);

		return data;
	}
}
