module.exports = {

	mypageInit: class {
		constructor({no_review_num = 0, matching_info_num = 0}){
			this.no_review_num = Number(no_review_num);
			this.matching_info_num = Number(matching_info_num);
		}
	},

	profileInfo: class {
		constructor({icon_url = "", user_name = "", email = "", prefectures = [], tags = []}){
			this.icon_url = icon_url;
			this.user_name = user_name;
			this.email = email;
			this.prefectures = prefectures;
			this.tags = tags;
		}
	},

	siteInfo: class {
		constructor({allow_bookmark_notification = false}){
			this.allow_bookmark_notification = allow_bookmark_notification;
		}
	}
}