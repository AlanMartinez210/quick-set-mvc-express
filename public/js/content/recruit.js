import plugin_prefecture from "../plugin/prefecture";
import recruitDetail from "./recruitDetail";
import _ from 'lodash';

export default class recruit {
	constructor () {
		this.recruitSearchForm = $('[name=recruitSearchForm]');
		this.recruitDetailForm = $('[name=recruitDetailForm]');
	}
	ready(){
		this.prefecture = new plugin_prefecture(this.app);
		this.recruitDetail = new recruitDetail(true);

		const $recruitSection = $("#recruitSection, #recruitTodaySection");
		const openSearchBtn = "#searchBtn";
		const opneRecruitDetailBtn = "[name=openRecruitDetail]";
		const doPostRequestBtn = "[name=doPostRequest]";
		const $doGetSearchRecruitListBtn = $('[name=doGetSearchRecruitList]');
		const $hiddenInputParam = $('input[type=hidden]');
		const $bookmarkCheck = $('.bookmark-box');

		// ブックマークボタンを開く
		$bookmarkCheck.on('click', 'input[type=checkbox]', e => {
			this.app.onShowProgress();
			const t = $(e.target);
			const sendData = {
				schedule_id: t.data("schedule_id"),
				mode: t.prop("checked") ? 1 : 0
			}

			this.app.sendPost("/recruitlist/bookmark", sendData)
			.done(result => {
				this.app.onHideProgress();
				this.app.showInfo("処理が完了しました。");
			})
		})

		// 検索モーダルを開く
		$recruitSection.on('click', openSearchBtn, {
			type: "search",
			onOpenBrefore: () => {
				this.recruitSearchForm.clearForm();
				this.prefecture.init().ready();
				
				// 検索データの取得
				const searchData = {};
				$hiddenInputParam.each(function(){
					let v = $(this).val();
					if($(this).val()){
						const n = $(this).attr("name");
						switch(n){
							case "prefectures_field":
								v = JSON.parse(v);
								break;
							case "shot_type":
								v = JSON.parse(v).code;
								break;
						}
						searchData[n] = v;
					}
				});
			
				this.recruitSearchForm.setValue(searchData);
				if(searchData.prefectures_field){
					searchData.prefectures_field.forEach(ele => {
						this.prefecture.addPrefecture(ele.pref_id, ele.pref_name);
					});
				}
			}
		}, e => this.app.showModal(e))

		// 検索ボタン処理
		$doGetSearchRecruitListBtn.on('click', (event) => {
			// 検索項目の取得
			const sendData = this.getSearchData();
			this.getSearchReqest(sendData);
			return false;
		})

		// 依頼/応募するボタン
		$recruitSection.on('click', doPostRequestBtn, (event) => this.sendReqest(event));
		this.recruitDetailForm.on('click', doPostRequestBtn, (event) => this.sendReqest(event));

		// 募集詳細モーダルを開く
		$recruitSection.on('click', opneRecruitDetailBtn, {
			type: "recruitDetail",
			onSyncOpenBrefore: (resolve, reject, event) => {
				// 募集IDの取得
				const schedule_id = event.currentTarget.dataset.schedule_id;
				// ボタンにセット
				this.recruitDetailForm.find(doPostRequestBtn).attr("data-schedule_id", schedule_id)

				// 値を取りに行く
				this.getRecruitDetail(schedule_id)
				.then(res => {
					this.recruitDetailForm.setValue(res);

					// カバー画像
					const bgPath = `/image/covers/${res.bg_image_url}`;
					$(".bgImage").css({
						background: `url(${bgPath}) no-repeat center`,
						backgroundSize: "cover"
					})

					// アイコン
					$("img[name=user_icon]").attr("src", `/image/icons/${res.icon_url}`)
					
					// 日付
					this.recruitDetailForm.find("[data-name=date_key]").text(`${res.date_info.year}年${res.date_info.month}月${res.date_info.day}日(${res.date_info.week})`)
					
					// タグ
					const $tags = this.recruitDetailForm.find("#tag_box");
					$tags.empty();
					res.tags.forEach(tag => $tags.append(`<span>${tag}</span>`));

					// 開催地
					const $prefectures = this.recruitDetailForm.find("#prefectures_box");
					$prefectures.empty();
					res.prefectures.forEach(pref => $prefectures.append(`<span>${pref.prefecture_name}</span>`));
					
					resolve();
				})
			}
		}, e => this.app.showModal(e))
		
		// 募集詳細のjsを呼び出す。
		this.recruitDetail.ready();
	}

	// ===============================================================================

	// 募集詳細情報を取得します。
	getRecruitDetail(schedule_id){
		return this.app.sendGet(`/recruitlist/detail/${schedule_id}`);
	}

	// 検索フォームから検索データを取得します。
	getSearchData(){
		// 値がなければ取得しない
		const formData = this.recruitSearchForm.getValue(false);
		const pref = this.prefecture.getPrefectureValue();
		if(!_.isEmpty(pref)) formData.prefectures_field = pref;
		
		return formData;
	}

	// 検索処理を行います。
	getSearchReqest(sendData = {}, pageNum = 1){
		const paramString = _.isEmpty(sendData) ? "" :  `&${$.param(sendData)}`;
		const path = `/recruitlist/${this.app.config.cntid === "recruit" ? "every" : "today"}/search?page=${pageNum}${paramString}`;

		// URLの書き換えを行う。
		location.href = path;
	}

	sendReqest(event){
		const sendData = $(event.currentTarget).data();

		this.app.showWarnDialog({
			name: "checkRecruit",
			title: this.app.config.isCos() ? "依頼の確認" : "応募の確認",
			text:　this.app.config.isCos() ? "依頼します。よろしいですか？" : "応募します。よろしいですか？" 
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				this.app.sendPost("/mypage/matching/request", sendData)
				.done(result => {
					this.app.onShowProgress()
					this.app.hideDialog();
					
					this.app.refresh({showInfo: "処理が完了しました。"});
				})
			}
		});

		return false;
	}
}