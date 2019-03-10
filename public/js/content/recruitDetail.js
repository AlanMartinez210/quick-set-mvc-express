import 'slick-carousel';
import _isArray from 'lodash/isArray';

export default class recruitDetail{
	constructor(app, modalFlg = false){
		this.app = app;
		this.isCallModal = modalFlg;
		this.recruitDetailForm = $('[name=recruitDetailForm]');
	}
	ready($myIdSection, myHandler){

		// ヘッダー背景
		const $headerBg = $(".hdr-cntnr");
		
		$myIdSection.on('click', myHandler, {
			type: "recruitDetail",
			onSyncOpenBrefore: (resolve, reject, event) => {
				// 募集IDの取得
				const schedule_id = event.currentTarget.dataset.schedule_id;

				// ボタンがあればセット
				this.recruitDetailForm.find("[name=doPostRequest]").attr("data-schedule_id", schedule_id);

				// 値を取りに行く
				this.getRecruitDetail(schedule_id)
				.then(res => {
					this.recruitDetailForm.setValue(res);

					// カバー画像
					const bgPath = `/image/covers/${res.bg_image_url}`;
					$(".bgImage").css({
						background: `url(${bgPath}) no-repeat center`,
						backgroundSize: "cover"
					})

					// アイコン
					$("img[name=user_icon]").attr("src", `/image/icons/${res.icon_url}`)

					// サンプル画像
					$(".my-slick-wrap").empty();
					if(_isArray(res.sample_image)){
						$(".my-slick-wrap").append("<div class='my-slick'></div>");
						const num = res.sample_image.length;
						let c = 0;
						for(const sample_image of res.sample_image){
							const img = new Image();
							img.onload = () => {
								c++;
								// 全画像読み終わり
								$(".my-slick").append(img);
								if(c === num){
									$(".my-slick").slick({
										dots: true,
										prevArrow: '<div class="prev-touch"></div>',
										nextArrow: '<div class="next-touch"></div>'
									});
									const height = $('.js-slickBtn').outerHeight();
									$('.prev-touch').css('height',height);
									$('.next-touch').css('height',height);
								}
							}
							img.src = `/image/sampleimages/${sample_image}`;
						}
					}
					
					// 日付
					this.recruitDetailForm.find("[data-name=date_key]").text(`${res.date_info.year}年${res.date_info.month}月${res.date_info.day}日(${res.date_info.week})`)
					
					// タグ
					const $tags = this.recruitDetailForm.find("#tag_box");
					$tags.empty();
					res.tags.forEach(tag => $tags.append(`<span>${tag}</span>`));

					// 開催地
					const $prefectures = this.recruitDetailForm.find("#prefectures_box");
					$prefectures.empty();
					res.prefectures.forEach(pref => $prefectures.append(`<span>${pref.prefecture_name}</span>`));
					
					// レビュー評価
					const $reviews = this.recruitDetailForm.find("#review_box");
					$reviews.empty();
					res.review_list.forEach(review =>{

						$reviews.append(`
							<div class='${review.review_type === 1 ? `good-review-box` : 'bad-review-box'}'>
								<p class='review-mention'>${review.review_comments}</p>
							</div>
						`);

					});
					resolve();
				});
				
			}
		}, e => this.app.showModal(e))
		
		if(this.isCallModal){
			this.detailModalHeaderDefine();

			$(window).on('resize', ()=>{
				this.detailModalHeaderDefine();
			})
		}
		else{

			const bgimage = $(".bgImage").data("bgimage");
			const bgPath = `/image/${bgimage}`;
			$headerBg.css({
				background: `url(${bgPath}) no-repeat center`,
				backgroundSize: "cover"
			})

			this.detailHeaderDefine();

			$(window).on('resize', ()=>{
				this.detailHeaderDefine();
			})
		}


	}

	// 募集詳細情報を取得します。
	getRecruitDetail(schedule_id){
		return this.app.sendGet(`/recruitlist/detail/${schedule_id}`);
	}

	detailHeaderDefine(){
		let hd = ($("body").width()/3)-24;
		hd = (hd >= 500) ? 500 : (hd <= 200) ? 200 : hd;
		$("div.recruitdetail-ptn").find("div.hdr-cntnr").height(hd);
	}

	detailModalHeaderDefine(){
		let hd = ($(".bgImage").width()/3);
		hd = (hd >= 320) ? 300 : (hd <= 180) ? 180 : hd;
		$("form.recruitdetail-ptn").find("div.hdr-cntnr").height(hd);
	}
}