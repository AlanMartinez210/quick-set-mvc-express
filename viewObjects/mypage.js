module.exports = {

	mypageInit: class {
		constructor({no_review_num = 0, matching_info_num = 0}){
			this.no_review_num = Number(no_review_num);
			this.matching_info_num = Number(matching_info_num);
		}
	},

	profileInit: class {
		constructor(profile_init = {}){
			this.user_id = profile_init.get("user_key");
		}
	},

	siteInfo: class {
		constructor({allow_bookmark_notification = false}){
			this.allow_bookmark_notification = allow_bookmark_notification;
		}
	}
}