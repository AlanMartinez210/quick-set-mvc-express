export default class site{
	constructor(){
		this.siteSettingForm = $("[name=siteSettingForm]")
	}
	ready(){
		$doSiteSettingBtn = $("[name=doSiteSettingPost]");

		$doSiteSettingBtn.on("click", (e) => {
			
		});
	}
}