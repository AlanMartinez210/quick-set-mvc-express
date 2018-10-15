import plugin_tag from "../../plugin/tag";
import plugin_prefecture from "../../plugin/prefecture";

export default class schedule{
	constructor(){
		this.scheduleForm = $('[name=scheduleForm]');
		this.tag = new plugin_tag();
		this.prefecture = new plugin_prefecture();
		this.tag.ready();
		this.prefecture.ready();
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
							this.scheduleForm.setValue(res);
							resolve();
						})
						break;
				}
			}
			
		}, c2.showModal);




		// 予定/募集の日付が変更された時
		// this.scheduleForm.find("[name=date_key]").on('change', () =>{
		// 	const schedule_id = $("[name=date_key]").dateVal();
		// 	console.log(schedule_id);
		// 	// $("[name=date_key_hidden]").dateVal(date_key);
		// 	this.getSchedule(schedule_id)
		// 	.done(data => {
		// 	})
		// 	.fail(err => {
		// 	})
		// })

		// scheduleSection.on('change', isExistSchedule, (e) => {
		// 	if($("#"+e.target.id).prop("checked")){
		// 		$(".empty").hide();
		// 	}
		// 	else{
		// 		$(".date-list li").show();
		// 	}
		// });

		// 登録/編集/削除ボタンの処理
		// doScheduleBtn.on('click', (e)=>{
		// 	const data = {};
	  //   this.scheduleForm.find('input, select, textarea').each((idx, ele)=>{
		// 		const ele_name = ele.name;
		// 		switch(ele_name){
		// 			case "date_key":
		// 				data[ele_name] = $(ele).dateVal();
		// 				break;
		// 			case "":
		// 			case "prefecture":
		// 				// 無視
		// 				break;
		// 			default:
		// 				data[ele_name] = $(ele).val();
		// 				break;
		// 		}
		// 	});
		// 	data.prefectures = $('[name=prefectures]').map((idx, ele) => {
		// 		return ele.value;
		// 	}).get();
		// 	data.tags = $('[name=tags]').map((i,ele) => {
		// 		return v.value;
		// 	}).get();
			
		// 	console.log(data);

		// 	// 投稿確認ダイアログを表示する
		// 	c2.showDialog("PostCheck")
		// 	.yes(e=>{
		// 		c2.onShowProgress();
		// 		c2.sendPost(`/mypage/schedule`, data)
		// 		.done(result => {
		// 			$('.month-label.seleced').click();
		// 			c2.showClearAll();
		// 		})
		// 		.always(result=>{
		// 			c2.onHideProgress();
		// 			c2.hideDialog();
		// 		})
		// 	})
		// 	.no(e=>{
		// 		c2.hideDialog();
		// 	});
		// 	return false;
		// });
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
		// this.scheduleForm.find("select").prop("readonly", true);
		this.scheduleForm.find("textarea").prop('readonly', true);
		this.scheduleForm.find("#box_prefectureField").hide();
		this.scheduleForm.find("#box_tagField").hide();
		this.scheduleForm.find("[name=date_key]").hide();
		this.scheduleForm.find("[name=date_key_hidden]").show();
		this.scheduleForm.find(".sub-label").hide();
	}

	// 変更有効時のモーダル制御
	modalEnable(){
		this.scheduleForm.find("input").prop('readonly', false);
		this.scheduleForm.find("input[name=date_key]").prop('readonly', true);
		// this.scheduleForm.find("select").prop("readonly", true);
		this.scheduleForm.find("textarea").prop('readonly', false);
		this.scheduleForm.find("#box_prefectureField").show();
		this.scheduleForm.find("#box_tagField").show();
		this.scheduleForm.find("[name=date_key]").show();
		this.scheduleForm.find("[name=date_key_hidden]").hide();
		this.scheduleForm.find(".sub-label").show();
	}
	
	// スケジュールの登録を行う。
	registerSchedule(){

	}
}
