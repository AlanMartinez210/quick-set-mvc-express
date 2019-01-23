import plugin_tag from "../../plugin/tag";
import plugin_prefecture from "../../plugin/prefecture";
import Cropper from 'cropperjs';


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

		// タグと都道府県のプラグインをロード
		this.tags.init().ready();
		this.prefs.init().ready();

		// ユーザー情報の取得
		const user_id = $("[name=user_id]").val();
		this.app.sendGet(`/mypage/profile/${user_id}`)
		.then(res => {
			console.log('res: ', res);
			this.profileForm.setValue(res);
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

		$editProfileIconBtn.on('click', {type: 'editProfileIcon'}, e => this.app.showModal(e));

		const image = document.getElementById('image');
		const blob = image.src;

		const cropper = new Cropper(image, {
			// autoCrop: false,
			ready() {
				// Do something here
				// ...
				console.log('ready');
				// And then
				//ßthis.cropper.crop();
				console.log(this.cropper.crop());
				console.log(this.cropper.getCroppedCanvas());
				const cropperCanvas = this.cropper.getCroppedCanvas();
			},
			dragMode() {
				console.log('move');
			},
			viewMode: 3,
			// crop: function(e) {
				// var base64img = $($('image').cropper('getCroppedCanvas')).getCanvasImage('png');
				// console.log(base64img);
				// uploadtoS3(base64img);
			// }
			// viewMode: 3,
			// dragMode: 'move',
			// autoCropArea: 1,
			// restore: false,
			// modal: true,
			// guides: true,
			// highlight: false,
			// cropBoxMovable: false,
			// cropBoxResizable: false,
			// toggleDragModeOnDblclick: false,
			// preview: '.img-preview',
			// aspectRatio: 1 / 1,
			// crop(event) {
			// 	console.log(event.detail.x);
			// 	console.log(event.detail.y);
			// 	console.log(event.detail.width);
			// 	console.log(event.detail.height);
			// 	console.log(event.detail.rotate);
			// 	console.log(event.detail.scaleX);
			// 	console.log(event.detail.scaleY);
			// },
			// zoomable:false,
			// minCropBoxWidth:162,
			// minCropBoxHeight:162
		});

// 		cropper.getCroppedCanvas();

// cropper.getCroppedCanvas({
//   width: 160,
//   height: 90,
//   minWidth: 256,
//   minHeight: 256,
//   maxWidth: 4096,
//   maxHeight: 4096,
//   fillColor: '#fff',
//   imageSmoothingEnabled: false,
//   imageSmoothingQuality: 'high',
// });

// // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`
// console.log(cropper);
// console.log(cropper.getCroppedCanvas());

// cropper.getCroppedCanvas().toDataURL((blob) => {
//   const formData = new FormData();

//   formData.append('croppedImage', blob);

//   // Use `jQuery.ajax` method
//   $.ajax('/path/to/upload', {
//     method: "POST",
//     data: formData,
//     processData: false,
//     contentType: false,
//     success() {
//       console.log('Upload success');
//     },
//     error() {
//       console.log('Upload error');
//     },
//   });
// });

// 		console.log('cropper',cropper);
		
		// Get the Cropper.js instance after initialized
		// var cropper = $image.data('cropper');
		// });

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
}