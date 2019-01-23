import { resolve } from "path";
import { rejects } from "assert";

export default class costume{
	constructor(){
		this.$costumeSection = $('#costumeSection');
		this.$confirmRegistCostumeForm = $('[name=confirmRegistCostumeForm]');
		this.$registCharaForm = $('[name=registCharaForm]');
		this.$registTitleForm = $('[name=registTitleForm]');
	}
	ready(call = {type: "costume"}){
		const $registTitle = $('#registTitle');
		const $registChara = $('#registChara');
		const $openRegistTitleModalBtn = $('[name=openRegistTitleModal]');
		const $openRegistCharaModalBtn = $('[name=openRegistCharaModal]');
		const $titleSearchBtn = $('[name=titleSearch]');
		const $search_content_title = $('[name=search_content_title]');
		const $titleList = $('#titleList');
		const $titleListNum = $("#titleListNum");
		const $backTitleBtn = $('[name=backTitle]');
		const $contentTitleName = $("[name=content_title_name]");
		const $confContentTitle = $("[name=conf_content_title]");

		const $contentCharaName = $("[name=content_chara_name");
		const $confContentChara = $("[name=conf_content_chara");

		const $charaList = $('#charaList');
		const $doPostCostumeBtn = $('[name=doPostCostume]');
		const $doPostRegistCharaBtn = $('[name=doPostRegistChara]');
		const $doPostRegistTitleBtn = $('[name=doPostRegistTitle]');

		const $hasCoutumeList = $('#has_coutume_list');
		
		// キャラクター登録、初期非表示
		$registChara.hide();

		if(call.type === "costume"){
			
			// 作品登録モーダルを開く
			$openRegistTitleModalBtn.on('click', {
				type: 'registTitle'
			}, e => this.app.showModal(e));

			// キャラクター登録モーダルを開く
			$openRegistCharaModalBtn.on('click', {
				type: 'registChara'
			}, e => this.app.showModal(e));
		
		}else if(call.type === "schedule"){

			// 作品登録モーダルに切り替える
			$openRegistTitleModalBtn.on('click', () => {
				this.app.switchModal("registTitle");
			})

			// キャラクター登録モーダルに切り替える
			$openRegistCharaModalBtn.on('click', () => {
				this.app.switchModal("registChara");
			})

		}

		// セット処理
		const parseCharaList = (searchData) => {
			$titleList.empty();
			if(searchData.rows && searchData.rows.length){
				for(const item of searchData.rows){
					$titleList.append(`
						<li name="titleListItem" data-title_id=${item.id} data-chara_list='${JSON.stringify(item.chara_list)}'>${item.name}</li>
					`);
				}
			}else{
				$titleList.append(`<li>候補がありません</li>`);
				$titleListNum.text(`候補一覧 (0件)`);
			}
		}
				
		// 作品検索ボタン
		$titleSearchBtn.on('click', e => {
			const sendData = { search_content_title: $search_content_title.val() } 
			// 検索条件をローカルストレージから検索(連打対策)
			const costumeSearch = sessionStorage.getItem("costumeSearch");
			if(costumeSearch){
				// 中身の検索結果をパースする。

			}
			const searchSession = sessionStorage.getItem(sendData.search_content_title);
			if(searchSession){
				parseCharaList(JSON.parse(searchSession));
			}
			else{
				this.searchTitle(sendData)
				.done(res => {
					// 検索結果をsessionStrageに保存
					sessionStorage.setItem(sendData.search_content_title, JSON.stringify(res));
					parseCharaList(res);
				});
			}
		});

		// 作品名リストをクリックしたとき
		$("ul#titleList").on('click', "li[name=titleListItem]", e => {

			const chara_list = $(e.currentTarget).data("chara_list");
			// 関連するキャラクター名を取得する。
			$charaList.empty();
			if(chara_list && chara_list.length){
				// chara_list = JSON.parse(chara_list);
				for(const item of chara_list){
					$charaList.append(`<li name="charaListItem" data-chara_id=${item.id}>${item.name}</li>`);
				}
			}
			else{
				$charaList.append(`<li>候補がありません</li>`);
			}

			$registTitle.hide();
			$registChara.fadeIn("fast");
			// キャラ選択に引き継ぐ情報を入れる
			$contentTitleName.val($(e.currentTarget).text());
			$confContentTitle.val($(e.currentTarget).data("title_id"));

		});
		
		
		// キャラクター名リストをクリックしたとき
		$("ul#charaList").on('click', "li[name=charaListItem]", {
			type: 'confirmRegistCostume',
			onOpenBrefore: (e) => {
				$(".proc-btn").hide();
				$(`[data-proc=create]`).show();
				$contentCharaName.val($(e.currentTarget).text());
				$confContentChara.val($(e.currentTarget).data("chara_id"));
			}
		}, e => this.app.showModal(e));
		
		// 衣装-登録/編集/削除
		$doPostCostumeBtn.on('click', e => {
			console.log(e.currentTarget);
			const procType = $(e.currentTarget).data("proc");
			switch(procType){
				case "create":
					this.registCostume(e);
					break;
				case "edit":
					this.editCostume(e);
					break;
				case "delete":
					this.deleteCostume(e);
					break;
			}

			return false;
		})

		// 作品選択に戻るボタン
		$backTitleBtn.on('click', e => {
			$titleList.empty();
			$titleList.append(`<li>候補がありません</li>`);
			$titleListNum.text(`候補一覧 (0件)`);
			$registChara.hide();
			$registTitle.fadeIn("fast");
		});

		// 作品新規登録ボタン
		$doPostRegistTitleBtn.on('click', e => {
			new Promise((resolve, reject) => {
				return this.registContentTitle(resolve, reject, e);
			})
			.then(res => {
				// 取得したデータを作品リストに追加する。
				$titleList.empty();
				$titleList.append(`
					<li name="titleListItem" data-title_id=${res.title_info.id} data-chara_list='${JSON.stringify(res.title_info.chara_list)}'>${res.title_info.name}</li>
				`);
				$titleListNum.text(`候補一覧 (1件)`);
			})
			
			return false;
		})

		// キャラクター新規登録ボタン 
		$doPostRegistCharaBtn.on('click', e => {
			new Promise((resolve, reject) => {
				return this.registContentChara(resolve, reject, e);
			})
			.then(res => {
				// 取得したデータをキャラリストに追加する。
				$charaList.prepend(`<li name="charaListItem" data-chara_id=${res.id}>${res.name}</li>`);
			})
			return false;
		});

		// 所持衣装一覧クリック処理
		$hasCoutumeList.on('click', 'li', {
			type: 'confirmRegistCostume',
			onSyncOpenBrefore : (resolve, reject, event) => {
					// リストからcostume_idを取得し、モーダルに展開する。
				const target_input = $(event.currentTarget).find('[name=has_chara_item]')[0];
				const costume_id = $(target_input).data('costume_id');

				// ボタンの制御
				$(".proc-btn").hide();
				$(`[data-proc=edit]`).show();
				$(`[data-proc=delete]`).show();

				// 衣装情報の取得
				this.app.sendGet(`/mypage/costume/${costume_id}`)
				.done(result => {
					this.$confirmRegistCostumeForm.setValue(result.costume_info)
					resolve();
				})
			}
		}, e => this.app.showModal(e))

		// 所持衣装の編集
	}

	//

	// 作品検索
	searchTitle(sendData = {}){
		return this.app.sendPost(`/mypage/costume/content`, sendData)
	}

	// 衣装登録処理
	registCostume(e){
		const sendData = this.$confirmRegistCostumeForm.getValue();
		this.app.showInfoDialog({
			name: 'checkCostumeCmf',
			title: "登録の確認",
			text: "この内容で登録します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				this.app.sendPost('/mypage/costume', sendData)
				.done(result => {
					// リフレッシュ
					this.app.refresh({showInfo: "処理に成功しました。"});
				})
			}
		})
	}

	// 衣装編集処理
	editCostume(e){
		const sendData = this.$confirmRegistCostumeForm.getValue();
		this.app.showInfoDialog({
			name: 'checkCostumeCmf',
			title: "更新の確認",
			text: "この内容で更新します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				this.app.sendPut('/mypage/costume', sendData)
				.done(result => {
					// リフレッシュ
					this.app.refresh({showInfo: "処理に成功しました。"});
				})
			}
		})
	}

	// 衣装削除処理
	deleteCostume(e){
		const sendData = this.$confirmRegistCostumeForm.getValue();
		this.app.showWarnDialog({
			name: 'checkCostumeCmf',
			title: "削除の確認",
			text: "この内容を削除します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				this.app.sendDelete('/mypage/costume', sendData)
				.done(result => {
					// リフレッシュ
					this.app.refresh({showInfo: "処理に成功しました。"});
				})
			}
		})
	}

	// 作品登録処理
	registContentTitle(resolve, reject, e){
		const sendData = this.$registTitleForm.getValue();

		// 同意の確認
		if(sendData.consent_regist_title){
			this.app.clearInputMsg("consent_regist_title");
			this.app.showInfoDialog({
				name: 'checkTitleCmf',
				title: "登録の確認",
				text: "この内容で登録します。よろしいですか？",
			})
			.closelabel("いいえ")
			.addBtn({
				callback: () => {
					this.app.sendPost('/mypage/costume/createtitle', sendData)
					.done(result => {
						if(result){
							resolve(result);
							this.app.hideDialog();
							this.app.showClearAll();
							this.app.showInfo("処理に成功しました。");
						}
					})
				}
			})
		}else{
			this.app.showInputErr("consent_regist_title", "チェックしてください。")
		}
	}

	// キャラクター登録処理
	registContentChara(resolve, reject, e){
		const sendData = this.$registCharaForm.getValue();
		// 同意の確認
		if(sendData.consent_regist_chara){
			this.app.showInfoDialog({
				name: 'checkCharaCmf',
				title: "登録の確認",
				text: "この内容で登録します。よろしいですか？",
			})
			.closelabel("いいえ")
			.addBtn({
				callback: () => {
					this.app.sendPost('/mypage/costume/createchara', sendData)
					.done(result => {
						if(result){
							resolve(result);
							this.app.hideDialog();
							this.app.showClearAll();
							this.app.showInfo("処理に成功しました。");
						}
					})
				}
			})
		}
		else{
			this.app.showInputErr("consent_regist_chara", "チェックしてください。")
		}
	}
}