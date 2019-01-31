import plugin_tag from "../../plugin/tag";
import plugin_prefecture from "../../plugin/prefecture";
import cropper from "../../plugin/cropper/cropper.min.js";
import "../../plugin/cropper/cropper.min.css";


export default class profile{
	constructor(){
		this.profileForm = $("[name=profileForm]");
		this.userDeleteForm = $("[name=userDeleteForm]");
	}
	ready(){
		this.tags = new plugin_tag(this.app);
		this.prefs = new plugin_prefecture(this.app);

		const doUserDeleteBtn = this.userDeleteForm.find('[name=doUserDelete]');
		const deleteBtn = $("#deleteBtn");
		const $userUpdateBtn = $("[name=doUserUpdate]");
		const consentDelete = this.userDeleteForm.find("#consentDelete");
		const $editProfileIconBtn = $("[name=doEditProfileIcon]")
		const $editBgCoverImgBtn = $("[name=doEditBgCoverImg]")

		// タグと都道府県のプラグインをロード
		this.tags.init().ready();
		this.prefs.init().ready();

		// ユーザー情報の取得
		const user_id = $("[name=user_id]").val();
		this.app.sendGet(`/mypage/profile/${user_id}`)
		.then(res => {
			console.log('res: ', res);
			this.profileForm.setValue(res);
			// アイコンの設定
			$(".icon-img").attr("src", `/image/icons/${res.icon_url}`);
			// カバー画像の設定
			$(".cover-img").attr("src", `/image/covers/${res.bg_image_url}`);
			res.tags.forEach(item => this.tags.addTags(item.tag_name));
			res.prefectures.forEach(item => this.prefs.addPrefecture(item.pref_id, item.pref_name));
		})

		// ユーザー情報の更新
		$userUpdateBtn.on("click", () => {

			const sendData = this.profileForm.getValue();
			
			// 都道府県の取得(カメラマン用)
			sendData.prefectures_field = this.prefs.getPrefectureValue();
			//タグの取得
			sendData.tag_field = this.tags.getTagValue();

			this.app.showInfoDialog({
				name: "checkCmf",
				title: "更新の確認",
				text: "この内容で更新します。よろしいですか？",
			})
			.closelabel("いいえ")
			.addBtn({
				callback: () => {
					this.app.sendPost("/mypage/profile", sendData)
					.done(result => {
						// localStorageを更新します。
						window.setLSUserData(result);
						this.app.refresh({showInfo: "処理が完了しました。"});
					})
				}
			});

			return false;

		});
		
		// アカウント削除ボタン
		deleteBtn.on('click', {type: "delete"}, e => this.app.showModal(e));
		doUserDeleteBtn.on('click', e => {
			if(consentDelete.prop('checked')){
				return this.userDelete(e);
			}
			else{
				this.app.showInputErr("consent_delete", "チェックを入れてください。");
				return false;
			}
		});

		// アイコンの変更
		$editProfileIconBtn.on('click', {
			type: 'editProfileIcon',
			onOpenBrefore: (e) => {
				$("[name=up_icon_image]").on('change', e => {
					$("#editProfileIconModal [data-mdc=trimming_box]").show();
					$("#editProfileIconModal [data-mdc=preview_box]").show();
					$("#editProfileIconModal [data-mdc=board-ftr]").show();
					this.imgCropper(e, "icon", $("[name=doPostIconData]"));
				});
			},
			onCloseBrefore: (e) => {
				// 初期化
				$("#iconThumbnail").cropper('destroy').attr("src", "");
				// fileオブジェクトの破棄
				$("[name=up_icon_image]").off('change');
				$("[name=up_icon_image]").val("");
			}
		}, e => this.app.showModal(e));

		// カバー背景の変更
		$editBgCoverImgBtn.on('click', {
			type: 'editBgCoverImg',
			onOpenBrefore: (e) => {
				$("[name=up_cover_image]").on('change', e => {
					$("#editBgCoverImgModal [data-mdc=trimming_box]").show();
					$("#editBgCoverImgModal [data-mdc=preview_box]").show();
					$("#editBgCoverImgModal [data-mdc=board-ftr]").show();
					this.imgCropper(e, "cover", $("[name=doPostCoverData]"));
				});
			},
			onCloseBrefore: (e) => {
				// 初期化
				$("#coverThumbnail").cropper('destroy').attr("src", "");
				// fileオブジェクトの破棄
				$("[name=up_cover_image]").off('change');
				$("[name=up_cover_image]").val("");
			}
		}, e => this.app.showModal(e));

	}

	/**
	 * ユーザーのアカウントを削除します。
	 */
	userDelete(e){
		const data = {
			consent_delete: this.userDeleteForm.find('[name=consent_delete]').val(),
			password: this.userDeleteForm.find('[name=password]').val()
		}
		this.app.sendPost('/api/delete', data)
		.done(() => {
			this.app.plugin.sessionMsg.setAccessMode('proc_comp');
			location.href = '/register';
		})
		return false;
	}

	imgCropper(e, type, $procBtn){
		// 初期化
		$(`#${type}Thumbnail`).cropper('destroy').attr("src", "");

		if($(`[name=up_${type}_image]`).val()){

			const image_file = $(e.currentTarget).prop('files')[0];

			// 拡張子チェック
			if (!/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(image_file.name) || !/(jpg|jpeg|png|gif)$/.test(image_file.type)) {
				this.app.showErrMsg("画像は(jpg/gif/png)形式を選択してください。");
				$(`[name=up_${type}_image]`).val("");
			}
			// else if (500000 < image_file.size) {
			// 	this.app.showErrMsg(`500KB以下の画像を添付してください。 現在(${image_file.size})`);
			// 	$("[name=up_icon_image]").val("");
			// }
			else{
				if(window.FileReader){
					const fr = new FileReader();
					fr.onload = () => {
						$(`#${type}Thumbnail`).attr("src", fr.result);
						$(`#${type}Thumbnail`).cropper({
							aspectRatio: type === "icon" ? 1/1 : 3/1,
							viewMode: 1,
							dragMode: 'move',
							rotatable: false,
							cropBoxResizable: false,
							cropBoxMovable: false,
							wheelZoomRatio: 0.05,
							preview: `.${type}_crop_preview`
						})
						$("[name=cropper_reset]").on('click', e => $(`#${type}Thumbnail`).cropper('reset'));
						$procBtn.on('click', e => this.dataSend(e, type, image_file.name));
					}
					fr.readAsDataURL(image_file);
				}
				else{
					$(`[name=up_${type}_image]`).val("");
				}
			}

		}
	}

	dataSend(e, type, filename){

		this.app.showInfoDialog({
			name: "checkCmf",
			title: "更新の確認",
			text: "この内容で更新します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				const croped_image = $(`#${type}Thumbnail`).cropper('getCroppedCanvas');
				
				const blobMethod = croped_image.toBlob ? "toBlob" : "msToBlob";
				croped_image[blobMethod]((blob) => {
					const trimedImageForm = new FormData();
					trimedImageForm.append(`${type}_imege`, blob, filename);

					const url = type === "icon" ? "/mypage/profile/profileIcon" : "/mypage/profile/bgCover"
					
					this.app.sendPost(url, trimedImageForm, {
						dataType: "json",
						contentType: false,
						processData: false
					})
					.done(result => {
						this.app.refresh({showInfo: "処理が完了しました。"});
					})
				})
			}
		});
		
		return false;
	}
}