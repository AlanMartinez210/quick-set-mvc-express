import recruitDetail from "../recruitDetail";
import plugin_pager from "../../plugin/pager";

export default class matching{
	constructor(){
	}
	ready(){
		this.recruitDetail = new recruitDetail(this.app, true);
		this.pager = new plugin_pager(this.app);

		const $matchingSection = $("#matchingSection");
		const $matchingStateSection = $("#matchingStateSection");
		const doPostMatchingBtn = "[name=doPostMatching]";
		const scheduleMore = "[name=scheduleMore]";

		$matchingSection.on('click', doPostMatchingBtn, {
			type: "recruitDetail",
			onSyncOpenBrefore: (resolve, reject, event) => {
				// 募集IDの取得
				const schedule_id = event.currentTarget.dataset.schedule_id;
				// 値を取りに行く
				this.app.sendGet(`/recruitlist/detail/${schedule_id}`)
				.then(res => {
					console.log('res: ', res);
					resolve();
				})
			}
		}, e => {
			const $t = $(e.currentTarget);
			const proc = $t.data("proc");
			
			switch(proc){
				case "confirm": // 確認
					// モーダルを開く
					this.app.showModal(e);
					break;
				case "consent": // 取消
				case "reject": // 承諾
					const url = `/mypage/matching/${proc}`;
					let dialog = {};
					const sendData = {};
					sendData.matching_id = $t.data("matching_id");
					
					if(proc === "reject") dialog = this.getRejectDialog();
					else if(proc === "consent") dialog = this.getConsentDialog();

					dialog.closelabel("いいえ")
					.addBtn({
						callback: () => {
							this.app.sendPost(url, sendData)
							.done(result => {
								$('.month-label.seleced').click();
								this.app.hideDialog();
								this.app.showClearAll();
								this.app.showInfo("処理に成功しました。");
							})
						}
					})

					break;
			}
		});

		// 募集詳細のjsを呼び出す。
		this.recruitDetail.ready($matchingStateSection, scheduleMore);
		this.pager.ready(["matchingHistorySection"]);
	}

	getRejectDialog() {
		return this.app.showWarnDialog({
			name: "checkDel",
			title: "取消の確認",
			text: "取消を行います。よろしいですか？"
		})
	}

	getConsentDialog() {
		return this.app.showInfoDialog({
			name: "checkCns",
			title: "承諾の確認",
			text: "このマッチングを承諾します。よろしいですか？"
		})
	}
}