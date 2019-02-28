export default class sampleImage{
	constructor(){
		this.$sampleImageListSection = $("#sampleImageListSection");
	}
	ready(){

		const $upSampleImage = $("[name=up_sample_image]");
		const $upIconImage = $("[name=up_icon_image]");
		const $doPostSampleImageBtn = $("[name=doPostSampleImage]");

		$upSampleImage.on("change", e => {
			// プレビューの設定
			if($upSampleImage.val()){

				const image_file = $(e.currentTarget).prop('files')[0];
				console.log('image_file: ', image_file);

				// 拡張子チェック
				if (!/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(image_file.name) || !/(jpg|jpeg|png|gif)$/.test(image_file.type)) {
					this.app.showErrMsg("画像は(jpg/gif/png)形式を選択してください。");
					$upIconImage.val("");
				}
				else{
					if(window.FileReader){
						const image = new Image();
						const fr = new FileReader();
						fr.onload = () => {
							$("#sampleImageThumbnail").attr("src", fr.result);
							$("#sample_imageSection [data-mdc=board-ftr]").show();
							image.src = fr.result;
							image.onload = () => {
								$doPostSampleImageBtn.off('click');
								$doPostSampleImageBtn.on('click', e => this.dataSend(e, 
									{file_obj: image_file, w: image.naturalWidth, h: image.naturalHeight}
								));
							}
						}
						fr.readAsDataURL(image_file);
					}
					else{
						$upIconImage.val("");
					}
				}
			
			}
		});

		this.$sampleImageListSection.on('click', '[name=doDeleteSampleImage]', (e) => {
			const $t = $(e.currentTarget);
			const sendData = {
				sample_Image_name: $t.data("siname")
			}
			console.log('$t: ', $t);
			console.log('sendData: ', sendData);
			this.app.showInfoDialog({
				name: "deleteCmf",
				title: "削除の確認",
				text: "この画像を削除します。よろしいですか？",
			})
			.closelabel("いいえ")
			.addBtn({
				callback: () => {
					this.app.sendDelete("/mypage/sampleImage", sendData, {dataType: "html"})
					.done(result => {
						this.app.hideDialog();
						this.$sampleImageListSection.html(result);
					})
				}
			});
			
			return false;

		})
	}

	dataSend(e, file_info){
		
		this.app.showInfoDialog({
			name: "checkCmf",
			title: "登録の確認",
			text: "この画像を登録します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {

				// リサイズ処理
				this.app.imageResize({
					file_obj: file_info.file_obj,
					max_w: 800,
					max_h: 300,
					callback: (blob) => {
						const fd = new FormData();
						fd.append("sample_image", blob, file_info.file_obj.name);
			
						this.app.sendPost("/mypage/sampleImage", fd, {
							dataType: "json",
							contentType: false,
							processData: false
						})
						.done(result => {
							this.app.refresh({showInfo: "処理が完了しました。"});
						})
					}
				});

			}
		});
		
		return false;
	}
}