import plugin_prefecture from "../plugin/prefecture";
import recruitDetail from "./recruitDetail";
import plugin_convert from "../plugin/convert";

export default class recruit {
	constructor () {
		this.recruitSearchForm = $('[name=recruitSearchForm]');
		this.prefecture = new plugin_prefecture();
		this.recruitDetail = new recruitDetail(true);
		this.convert = new plugin_convert();
	}
	ready(){
		const $recruitSection = $("#recruitSection");
		const openSearchBtn = "#searchBtn";
		const opneRecruitDetailBtn = "[name=openRecruitDetail]";
		const $doGetSearchRecruitListBtn = $('[name=doGetSearchRecruitList]'); 

		// 検索モーダルを開く
		$recruitSection.on('click', openSearchBtn, {
			type: "search",
			onOpenBrefore: ()=>{
				this.recruitSearchForm.clearForm();
				this.prefecture.init().ready();

				const searchData = c2.getUrlParam();
			
				this.recruitSearchForm.setValue(searchData);
				if(searchData.prefectures_field){
					searchData.prefectures_field.split(",").forEach(ele => {
						this.prefecture.addPrefecture(ele);
					});
				}
			}
		}, c2.showModal)

		// 募集詳細モーダルを開く
		$recruitSection.on('click', opneRecruitDetailBtn, {
			type: "recruitDetail",
			onSyncOpenBrefore: (resolve, reject, event) => {
				// 募集IDの取得
				const recruit_list_id = event.currentTarget.dataset.recruitlistid;
				// 値を取りに行く
				this.getRecruitDetail(recruit_list_id)
				.then(res => {
					resolve();
				})
			}
		}, c2.showModal)

		// 検索ボタン処理
		$doGetSearchRecruitListBtn.on('click', (event) => {
			const sendData = this.getSearchData();
			this.getSearchReqest(sendData, 1)
			return false;
		})
		
		// 募集詳細のjsを呼び出す。
		this.recruitDetail.ready();
	}

	// 募集詳細情報を取得します。
	getRecruitDetail(recruit_list_id){
		return c2.sendGet(`/recruitlist/detail/${recruit_list_id}`);
	}

	// 検索フォームから検索データを取得します。
	getSearchData(){
		const formData = this.recruitSearchForm.getValue();
		formData.prefectures_field = this.prefecture.getPrefectureValue();
		return formData;
	}

	// 検索処理を行います。
	getSearchReqest(sendData = {}, pageNum = 1){
		sendData.page = pageNum;
		const paramString = this.convert.jsonToUrlParam(sendData);

		const path = `/recruitlist/search?${paramString}`;

		// URLの書き換えを行う。
		location.href = path;
	}
}