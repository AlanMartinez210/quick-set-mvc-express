import 'slick-carousel';

export default class recruitDetail{
	constructor(modalFlg = false){
		this.isCallModal = modalFlg; 
	}
	ready(){
		// スライダー
		const $slick = $(".my-slick");
		// ヘッダー背景
		const $headerBg = $(".hdr-cntnr");
		
		$slick.slick({
			dots: false,
			prevArrow: '<div class="prev-touch"></div>',
			nextArrow: '<div class="next-touch"></div>'
		});

		setTimeout(()=> {
			const height = $('.js-slickBtn').outerHeight();
			$('.prev-touch').css('height',height);
			$('.next-touch').css('height',height);
		}, 0);

		
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