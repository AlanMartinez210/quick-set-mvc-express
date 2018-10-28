import plugin_prefecture from "../plugin/prefecture";

export default class recruit {
	constructor () {
		this.recruitSearchForm = $('[name=recruitSearchForm]');
		this.prefecture = new plugin_prefecture();
	}
	ready(){
		// const do_post_btn = this.recruitSearchForm.find('[name=doPost]');
		const $recruitSection = $("#recruitSection");
		const openSearchBtn = "#searchBtn";

		// 検索モーダルを開く
		$recruitSection.on('click', openSearchBtn, {
			type: "search",
			onOpenBrefore: ()=>{
				this.prefecture.ready();
			}
		}, c2.showModal)
		
		const shot_type_arr = $("[data-shot_type]");

		shot_type_arr.each((i, ele) => {
			console.log(ele.dataset);
			let type_css;
			switch(Number(ele.dataset.shot_type)){
				case 1:
					type_css = "st-type-event";
					break;
				case 2:
					type_css = "st-type-portrait";
					break;
				case 3:
					type_css = "st-type-private";
					break;
				case 4:
					type_css = "st-type-studio";
					break;
				default:
					type_css = "st-type-other"; 
					break;
			}
			ele.classList.add(type_css);
		});
	}
}