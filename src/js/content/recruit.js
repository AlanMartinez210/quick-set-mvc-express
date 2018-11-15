import plugin_prefecture from "../plugin/prefecture";
import recruitDetail from "./recruitDetail";
import plugin_convert from "../plugin/convert";
import cookies from "js-cookie";

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

		// console.log(c2.isSameReferrer());
		// // 違うページからのアクセスならcookieを消す
		// if(!c2.isSameReferrer()){
		// 	document.cookie = "search_info=;path=/recruitlist";
		// }

		// ページャー処理
		$recruitSection.on('click', "#recruitlistPager span", (e) => {
			// undefindなら直近の親要素も捜す
			const $t = $(e.target);
			if($t.hasClass("selected")) return false;

			let pageNum = $t.data("page") || $(e.target).closest("span").data("page");

			// sendData.search_date_from = this.convert.serverDate(sendData.search_date_from);
			// sendData.search_date_to = this.convert.serverDate(sendData.search_date_to);
			this.postSearchReqest(sendData, pageNum);
		})


		// 検索モーダルを開く
		$recruitSection.on('click', openSearchBtn, {
			type: "search",
			onOpenBrefore: ()=>{
				this.recruitSearchForm.clearForm();
				this.prefecture.init().ready();

				// cookieから検索データを取得する。
				console.log(cookies.getJSON("search_info"));
			

				// const searchData = JSON.parse($("[name=searchInfo]").val());
				// this.recruitSearchForm.setValue(searchData);
				// searchData.prefectures_field.forEach(ele => {
				// 	this.prefecture.addPrefecture(ele);
				// });
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
			this.postSearchReqest(sendData, 1)
			// .done(() => {
			// 	// 検索内容をcookieに保存する。
			// 	c2.showClearAll();
			// })
			return false;
		})
		
		this.recruitDetail.ready();
	}

	// 募集詳細情報を取得します。
	getRecruitDetail(recruit_list_id){
		return c2.sendGet(`/recruitlist/detail/${recruit_list_id}`);
	}

	// 検索フォームから検索データを取得します。
	getSearchData(){
		const formData = this.recruitSearchForm.getValue();
		formData.search_date_from = this.convert.serverDate(formData.search_date_from);
		formData.search_date_to = this.convert.serverDate(formData.search_date_to);
		formData.prefectures_field = this.prefecture.getPrefectureValue();
		return formData;
	}

	// 検索処理を行います。
	postSearchReqest(sendData, pageNum = 1){
		sendData.page = pageNum;
		const paramString = this.convert.jsonToUrlParam(sendData);
		console.log(paramString);
		const path = `/recruitlist/search?${paramString}`;

		// URLの書き換えを行う。
		//history.replaceState('', '', path);
		location.href = path;
	
		// return c2.sendGet(path, {}, {dataType: "html"})
		// .done(results => {
		// 	$('#recruitSection').html(results);
		// });
	}
}