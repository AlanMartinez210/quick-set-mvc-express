import plugin_prefecture from "../plugin/prefecture";
import recruitDetail from "./recruitDetail";
import _ from 'lodash';

export default class recruit {
	constructor () {
		this.recruitSearchForm = $('[name=recruitSearchForm]');
	}
	ready(){
		this.prefecture = new plugin_prefecture(this.app);
		this.recruitDetail = new recruitDetail(true);

		const $recruitSection = $("#recruitSection");
		const openSearchBtn = "#searchBtn";
		const opneRecruitDetailBtn = "[name=openRecruitDetail]";
		const doPostRequestBtn = "[name=doPostRequest]";
		const $doGetSearchRecruitListBtn = $('[name=doGetSearchRecruitList]');

		// 検索モーダルを開く
		$recruitSection.on('click', openSearchBtn, {
			type: "search",
			onOpenBrefore: () => {
				this.recruitSearchForm.clearForm();
				this.prefecture.init().ready();

				const searchData = this.app.getUrlParam();
				console.log('searchData: ', searchData);
			
				this.recruitSearchForm.setValue(searchData);
				if(searchData.prefectures_field){
					searchData.prefectures_field.split(",").forEach(ele => {
						this.prefecture.addPrefecture(ele);
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
		$recruitSection.on('click', doPostRequestBtn, (event) => {
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
			})

		});

		// 募集詳細モーダルを開く
		$recruitSection.on('click', opneRecruitDetailBtn, {
			type: "recruitDetail",
			onSyncOpenBrefore: (resolve, reject, event) => {
				// 募集IDの取得
				const schedule_id = event.currentTarget.dataset.schedule_id;
				// 値を取りに行く
				this.getRecruitDetail(schedule_id)
				.then(res => {
					resolve();
				})
			}
		}, e => this.app.showModal(e))
		
		// 募集詳細のjsを呼び出す。
		this.recruitDetail.ready();
	}

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
		const path = `/recruitlist/search?page=${pageNum}${paramString}`;

		// URLの書き換えを行う。
		location.href = path;
	}
}