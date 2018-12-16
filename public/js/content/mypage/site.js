export default class site{
	constructor(){
		this.siteSettingForm = $("[name=siteSettingForm]")
	}
	ready(){
		const $doSiteSettingBtn = $("[name=doSiteSettingPost]");

		$doSiteSettingBtn.on("click", (e) => {
			
		});
	}
}