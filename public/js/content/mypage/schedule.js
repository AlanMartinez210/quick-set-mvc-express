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
		// 質問からタグを作るボタン
		const $tagGenBtn =  $("[name=tagGen]");
		// あわせ募集に戻るボタン
		const $bkGroupBtn = $("[name=bk_group]");

		// 質問からタグを作る完了ボタン
		const $doTagGenerateBtn =  $("[name=doTagGenerate]");
		this.tags = new plugin_tag(this.app, this.app.config.isCos(true) ? "cos_shedule_tags" : "cam_shedule_tags");
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
			$("#"+e.target.id).prop("checked") ? $(".empty").hide() : $(".date-list li").show();
		});

		// キャラクター検索モーダルの切り替え
		$addCharaBtn.on("click", () => {
			this.app.switchModal("charaSearch", true);
		});

		// 質問からタグを作るモーダルの切り替え
		$tagGenBtn.on("click", () => {
			this.app.switchModal("tagGenerator", true);
		});

		// スケジュール/あわせ募集に戻る
		$bkGroupBtn.on("click", () => {
			this.app.switchModal("createSchedule");
		});

		// タグ作成完了処理
		$doTagGenerateBtn.on("click", () => {

			this.app.showWarnDialog({
				name: "checkAddTag",
				title: "タグ作成の確認",
				text: `
				<p>タグの作成を行います。<br /><br />
				<p class="c-red">※一覧に追加されているタグは消えてしまいますので、ご注意ください。</p>
			`
			})
			.closelabel("タグ作成に戻る")
			.addBtn({
				callback: () => {
					const tagGenData = $("[name=tagGeneratorForm]").getValue();
					this.tags.init().ready();
					Object.keys(tagGenData).forEach(key => {
						if(tagGenData[key].checked) this.tags.addTags(tagGenData[key].value)
					})
					this.app.hideDialog();
					this.app.switchModal("createSchedule");
				}
			})
			
			return false;
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
		if(this.app.config.isCos())	data.costume_field = this.p_costume.getCostumeValue();
		
		//タグの取得
		data.tag_field = this.tags.getTagValue();
		return data;
	}

	openScheduleModal(openMode, resolve, reject, event){
	
		const procType = event.currentTarget.dataset.mode;

		// モーダルの初期化
		new Promise((inResolve, inReject) => {
			return this.openInitModal(openMode, inResolve, inReject, event);
		})
		.then(() => {
			switch(procType){
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
				default:
					resolve();
					break;
			}
		})
	}

	openInitModal(openMode, resolve, reject, event){
		this.app.plugin.screen.tabInit();

		// タグと都道府県のプラグインをロード
		this.tags.init().ready();
		this.prefs.init().ready();
		this.p_costume.init().ready();

		// formを初期化する 
		this.scheduleForm.clearForm();

		if(openMode === "reference"){
			this.modalDisable();
		}
		else{
			this.modalEnable();
			// 対象ボタンの表示
			$(".proc-btn").hide();
			$(`[data-proc=${event.currentTarget.dataset.mode}]`).show();
		}

		// 日付の設定
		const date_key = event.currentTarget.dataset.date_key;
		this.scheduleForm.find('[name=date_key]').val(date_key);

		// コスプレイヤーならコスチューム情報を取得する。
		if(this.app.config.isCos()){
			this.app.sendGet(`/mypage/costume/list`)
			.then(cosList => {
				if(cosList && cosList.rows){
					cosList.rows.forEach(item => {
						$("#costumes").append($('<option>', {value: item.costume_id, text: `${item.title}-${item.chara}`}));
					})
				}
				return resolve();
			})
		}
		else{
			return resolve();
		}
	}
}
