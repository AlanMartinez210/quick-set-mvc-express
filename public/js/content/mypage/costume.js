export default class costume{
	constructor(){
		this.$costumeSection = $('#costumeSection');
		this.$confirmRegistCostumeForm = $('[name=confirmRegistCostumeForm]');
		this.$registCharaForm = $('[name=registCharaForm]');
		this.$registTitleForm = $('[name=registTitleForm]');
	}
	ready(){
		const $registTitle = $('#registTitle');
		const $registChara = $('#registChara');
		const openRegistTitleModalBtn = '[name=openRegistTitleModal]';
		const openRegistCharaModalBtn = '[name=openRegistCharaModal]';
		const titleSearchBtn = '[name=titleSearch]';
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
		
		// キャラクター登録、初期非表示
		$registChara.hide();

		// 作品登録モーダルを開く
		this.$costumeSection.on('click', openRegistTitleModalBtn, {
			type: 'registTitle'
		}, e => this.app.showModal(e));

		// キャラクター登録モーダルを開く
		this.$costumeSection.on('click', openRegistCharaModalBtn, {
			type: 'registChara'
		}, e => this.app.showModal(e));

		// 作品検索ボタン
		this.$costumeSection.on('click', titleSearchBtn, e => {
			new Promise((resolve, reject) => this.searchTitle(resolve, reject, e))
			.then(res => {
				// 検索候補一覧に内容を適応する。
				this.genList($titleList, res, "title");
				// 検索数
				$titleListNum.text(`候補一覧 (${res.count}件)`);
			})
		});

		// 作品名リストをクリックしたとき
		this.$costumeSection.on('click', "ul#titleList li[name=titleListItem]", e => {
			// 関連するキャラクター名を取得する。
			new Promise((resolve, reject) => this.searchChara(resolve, reject, e))
			.then(res => {
				
				// キャラクター名リストの作成
				this.genList($charaList, res, "chara");

				$registTitle.hide();
				$registChara.fadeIn("fast");
				// キャラ選択に引き継ぐ情報を入れる
				$contentTitleName.val($(e.currentTarget).text());
				$confContentTitle.val($(e.currentTarget).data("title_id"));

			});
		});

		// キャラクター名リストをクリックしたとき
		this.$costumeSection.on('click', "ul#charaList li[name=charaListItem]", {
			type: 'confirmRegistCostume',
			onOpenBrefore: (e) => {
				$(".proc-btn").hide();
				$(`[data-proc=create]`).show();
				$contentCharaName.val($(e.currentTarget).text());
				$confContentChara.val($(e.currentTarget).data("chara_id"));
			}
		}, e => this.app.showModal(e));
		
		// 衣装登録
		$doPostCostumeBtn.on('click', e => {
			this.registCostume(e);
			return false;
		})

		// 作品選択に戻るボタン
		$backTitleBtn.on('click', e => {
			$registChara.hide();
			$registTitle.fadeIn("fast");
		});

		// 作品新規登録ボタン
		$doPostRegistTitleBtn.on('click', e => {
			this.registContentTitle(e);
			return false;
		})

		// キャラクター新規登録ボタン 
		$doPostRegistCharaBtn.on('click', e=> {
			this.registContentChara(e);
			return false;
		});

	}

	//

	// 作品検索
	searchTitle(resolve, reject, e){
		// 作品検索の入力内容の取得
		
		resolve({
			rows: [
				{id: 1, name: "ひなまつり"},
				{id: 2, name: "ドールズフロントライン"},
				{id: 3, name: "グランブルーファンタジー"},
				{id: 4, name: "うちのメイドがウザすぎる"},
			],
			count: 4
		})
	}

	// キャラクター検索
	searchChara(resolve, reject, e){
		// キャラクター検索の入力内容の取得
		resolve({
			rows: [
				{id: 1, name: "新田ひな"},
				{id: 2, name: "アンズ"},
				{id: 3, name: "三島瞳"},
				{id: 4, name: "マオ"},
			]
		})
	}
	// 作品登録処理
	registContentTitle(e){

		this.app.showInfoDialog({
			name: 'checkCostumeCmf',
			title: "登録の確認",
			text: "この内容で登録します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				this.app.sendPost('/mypage/costume', 'sendData')
				.done(result => {
					$('.month-label.seleced').click();
					this.app.hideDialog();
					this.app.showClearAll();
					this.app.showInfo("処理に成功しました。");
				})
			}
		})

	}
	// キャラクター登録処理
	registContentChara(e){

		this.app.showInfoDialog({
			name: 'checkCostumeCmf',
			title: "登録の確認",
			text: "この内容で登録します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				this.app.sendPost('/mypage/costume/createchara', 'sendData')
				.done(result => {
					$('.month-label.seleced').click();
					this.app.hideDialog();
					this.app.showClearAll();
					this.app.showInfo("処理に成功しました。");
				})
			}
		})
		
	}
	// 衣装登録処理
	registCostume(e){

		this.app.showInfoDialog({
			name: 'checkCostumeCmf',
			title: "登録の確認",
			text: "この内容で登録します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				this.app.sendPost('/mypage/costume/createtitle', 'sendData')
				.done(result => {
					$('.month-label.seleced').click();
					this.app.hideDialog();
					this.app.showClearAll();
					this.app.showInfo("処理に成功しました。");
				})
			}
		})

	}

	// 候補一覧の生成
	genList($list, listObj, type){
		$list.empty();
		if(listObj.rows.length){
			for(const item of listObj.rows){
				$list.append(`<li name="${type}ListItem" data-${type}_id=${item.id}>${item.name}</li>`);
			}
		}else{
			$list.append(`<li>候補がありません</li>`);
		}
	}

}