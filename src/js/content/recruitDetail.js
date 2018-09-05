import { baseApp } from '../baseApp';
import 'slick-carousel';

export default class detail extends baseApp{
	getFunc(){
		this.ready(()=>{
			this.detailHeaderDefine();
			const bgimage = $(".bgImage").data("bgimage");
			$(".hdr-cntnr").css({
				background: `url("/image/${bgimage}") no-repeat center`,
				backgroundSize: "cover"
			})
			$(".my-slick").slick({
				dots: false,
				prevArrow: '<div class="prev-touch"></div>',
				nextArrow: '<div class="next-touch"></div>'
			});
			setTimeout(()=> {
				const height = $('.js-slickBtn').outerHeight();
				$('.prev-touch').css('height',height);
				$('.next-touch').css('height',height);
			}, 0);
			
			$(window).on('resize', ()=>{
				this.detailHeaderDefine();
			});
		});
	}
	detailHeaderDefine(){
		let hd = ($("body").width()/3)-24;
		hd = (hd >= 500) ? 500 : (hd <= 200) ? 200 : hd;  
		$("div.recruitdetail-ptn").find("div.hdr-cntnr").height(hd) ;
	}
}