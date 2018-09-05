export default class recruit {
	constructor () {
		this.form = $('[name=recruitForm]');
	}
	ready(){
		const do_post_btn = this.form.find('[name=doPost]');
		const shot_type_arr = $("[data-shot_type]");

		shot_type_arr.each((i, ele) => {
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