export default class sampleImage{
	constructor(){

	}
	ready(){
		$("[name=up_sample_image]").on("change", e => {
			// プレビューの設定
			if($("[name=up_sample_image]").val()){

				const image_file = $(e.currentTarget).prop('files')[0];
				console.log('image_file: ', image_file);

				// 拡張子チェック
				if (!/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(image_file.name) || !/(jpg|jpeg|png|gif)$/.test(image_file.type)) {
					this.app.showErrMsg("画像は(jpg/gif/png)形式を選択してください。");
					$("[name=up_icon_image]").val("");
				}
				// else if (500000 < image_file.size) {
				// 	this.app.showErrMsg(`500KB以下の画像を添付してください。 現在(${image_file.size})`);
				// 	$("[name=up_icon_image]").val("");
				// }
				else{
					if(window.FileReader){
						const fr = new FileReader();
						fr.onload = () => {
							$("#sampleImageThumbnail").attr("src", fr.result);
							// $("[name=doPostIconData]").on('click', e => this.dataSend(e, image_file.name));
						}
						fr.readAsDataURL(image_file);
					}
					else{
						$("[name=up_icon_image]").val("");
					}
				}
			
			}
		});
	}

	dataSend(e, filename){

		this.app.showInfoDialog({
			name: "checkCmf",
			title: "更新の確認",
			text: "この内容で更新します。よろしいですか？",
		})
		.closelabel("いいえ")
		.addBtn({
			callback: () => {
				const croped_image = $("#iconThumbnail").cropper('getCroppedCanvas');
				
				const blobMethod = croped_image.toBlob ? "toBlob" : "msToBlob";
				croped_image[blobMethod]((blob) => {
					const trimedImageForm = new FormData();
					trimedImageForm.append('icon_imege', blob, filename);
					
					this.app.sendPost("/mypage/profile/profileIcon", trimedImageForm, {
						dataType: "json",
						contentType: false,
						processData: false
					})
					.done(result => {
						// this.app.refresh({showInfo: "処理が完了しました。"});
					})
				})
			}
		});
		
		return false;
	}
}