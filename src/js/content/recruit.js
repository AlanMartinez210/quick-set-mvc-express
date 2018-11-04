import plugin_prefecture from "../plugin/prefecture";
import recruitDetail from "./recruitDetail";

export default class recruit {
	constructor () {
		this.recruitSearchForm = $('[name=recruitSearchForm]');
		this.prefecture = new plugin_prefecture();
		this.recruitDetail = new recruitDetail(true);
	}
	ready(){
		const $doRequestBtn = $('[name=doRequestPost]');
		const $recruitSection = $("#recruitSection");
		const openSearchBtn = "#searchBtn";
		const opneRecruitDetailBtn = "[name=openRecruitDetail]";

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

		// 依頼するボタンの処理
		$doRequestBtn.on('click', (event) => {
			let path = "/mypage/schedule";
			let data = {recruit_list_id: 60};
			let dialog = {};

			if(c2.config.isCam()){
				dialog = c2.showInfoDialog({
					name: "checkRecest",
					title: "応募の確認",
					text: "この募集に応募します。よろしいですか？"
				})
			}else{
				dialog = c2.showInfoDialog({
					name: "checkRecest",
					title: "依頼の確認",
					text: "このカメラマンに依頼します。よろしいですか？"
				})
			}

			dialog.closelabel("いいえ")
			.addBtn({
				callback: function() {
					c2.onShowProgress();
					c2.sendPost(path, data)
					.always(result=>{
						c2.onHideProgress();
						c2.hideDialog();
					})
					.done(result => {
						c2.showClearAll();
						c2.showInfo("処理に成功しました。")
					})
				}
			})
	
			return false;
		});
		
		this.recruitDetail.ready();
	}
	getRecruitDetail(recruit_list_id){
		return c2.sendGet(`/recruitlist/detail/${recruit_list_id}`);
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