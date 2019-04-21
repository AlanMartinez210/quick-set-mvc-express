export default class costume{
	constructor(){
		this.$costumeSection = $('#costumeSection');
		this.$confirmRegistCostumeForm = $('[name=confirmRegistCostumeForm]');
	}
	ready(call = {type: "costume"}){

		// コスプレするキャラクターの検索
		const $charaList = $("#charaList");
		const $countCharaList = $("#countCharaList");
		$("[name=search_chara_keyword_btn]").on('click', () => {
			const sendData = $("[name=searchCharaForm]").getValue();
			this.searchChara(sendData)
			.done(res => {
				$charaList.empty();
				if(res.rows && res.rows.length){
					for(const item of res.rows){
						$charaList.append(this.getCharaListHTML(item.id, item.name, item.title_info.name));
					}
					if(res.count) $countCharaList.text(`作品候補一覧 (${res.count}件)`);
				}else{
					$charaList.append(this.getCharaListHTML());
					$countCharaList.text(`候補一覧 (0件)`);
				}
			});
		});
		
		// キャラクター名リストをクリックしたとき
		const $confTitleName = $("[name=conf_title_name");
		const $confCharaName = $("[name=conf_chara_name");
		const $confCharaId = $("[name=conf_chara_id");
		$("ul#charaList").on('click', "li[name=charaListItem]", {
			type: 'confirmRegistCostume',
			onSyncOpenBrefore : (resolve, reject, event) => {
				
				$(".proc-btn").hide();
				$('[data-proc=create]').show();
				
				// キャラクター情報を取得
				this.getCharaInfo({chara_id: $(event.currentTarget).data("chara_id")})
				.done(res => {
					// 値の設定
					$confTitleName.val(res.item.title_info.name);
					$confCharaName.val(res.item.name);
					$confCharaId.val(res.item.id);
					return resolve();
				})
			}
		}, e => this.app.showModal(e));
		
		// 衣装-登録/編集/削除
		$('[name=doPostCostume]').on('click', e => {
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

		// 所持衣装一覧クリック処理
		$('#has_coutume_list').on('click', 'li', {
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
					console.log('result: ', result);
					this.$confirmRegistCostumeForm.setValue({
						costume_id: result.item.costume_id,
						conf_title_name: result.item.content_title_name,
						conf_chara_name: result.item.content_chara_name,
						costume_comment: result.item.costume_comment,
					})
					resolve();
				})
			}
		}, e => this.app.showModal(e))

	}

	//

	// キャラクターの検索
	searchChara({search_type, keyword} = sendData){
		return this.app.sendGet(`/api/content/search/${search_type === "1" ? 'title' : 'chara'}?keyword=${keyword}`)
	}

	// キャラクターの検索
	getCharaInfo({chara_id} = sendData){
		return this.app.sendGet(`/api/content/chara?id=${chara_id}`)
	}

	// キャラクター検索結果一覧のHTMLを取得します。
	getCharaListHTML(chara_id, chara_name, title_name){
		return `<li ${chara_id ? `name='charaListItem' data-chara_id=${chara_id}` : "" } >
			<div class="label-link">
				<a ${chara_id ? "" : "href='/mypage'"} class="flex _c">
					<div class="st-string-set">
						<p>${ chara_name || "キャラクターが見つかりません…" }</p>
						<span class="sub-text">${ title_name || "こちらからキャラクター登録をお願いします。" }</span>
					</div>
					<i class="icon-link fas fa-chevron-right fa-fw"></i>
				</a>
			</div>
		</li>`
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
					// localStorageを更新します。
					window.setLSUserData(result);
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
					// localStorageを更新します。
					window.setLSUserData(result);
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
					// localStorageを更新します。
					window.setLSUserData(result);
					// リフレッシュ
					this.app.refresh({showInfo: "処理に成功しました。"});
				})
			}
		})
	}
}