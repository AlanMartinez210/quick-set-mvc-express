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
		const $doRequestBtn = $('[name=doRequestPost]');
		const $recruitSection = $("#recruitSection");
		const openSearchBtn = "#searchBtn";
		const opneRecruitDetailBtn = "[name=openRecruitDetail]";
		const $doGetSearchRecruitListBtn = $('[name=doGetSearchRecruitList]'); 

		c2.inputClear();

		this.setShotType();

		// 検索モーダルを開く
		$recruitSection.on('click', openSearchBtn, {
			type: "search",
			onOpenBrefore: ()=>{
				this.prefecture.ready();
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
					console.log(res);
					resolve();
				})
			}
		}, c2.showModal)

		// 検索ボタン処理
		$doGetSearchRecruitListBtn.on('click', (event) => {
			c2.onShowProgress();
			const path = "/recruitlist/search";
			const sendData = this.getSearchData();

			c2.sendPost(path, sendData, {dataType: "html"})
			.done(results => {
				c2.showClearAll();
				$('#recruitSection').html(results);
			})

			return false;
		})
		
		this.recruitDetail.ready();
	}
	getRecruitDetail(recruit_list_id){
		return c2.sendGet(`/recruitlist/detail/${recruit_list_id}`);
	}
	getSearchData(){
		const formData = this.recruitSearchForm.getValue();
		formData.search_date_from = this.convert.serverDate(formData.search_date_from);
		formData.search_date_to = this.convert.serverDate(formData.search_date_to);
		formData.prefectures_field = this.prefecture.getPrefectureValue();
		return formData;
	}
	setShotType(){
		const shot_type_arr = $("[data-shot_type]");

		shot_type_arr.each((i, ele) => {
			let type_css;
			switch(Number(ele.dataset.shot_type)){
				case 1:
					type_css = "st-type-event";
					break;
				case 2:
					type_css = "st-type-portrait";
					break;
				case 3:
					type_css = "st-type-private";
					break;
				case 4:
					type_css = "st-type-studio";
					break;
				default:
					type_css = "st-type-other"; 
					break;
			}
			ele.classList.add(type_css);
		});
	}
}