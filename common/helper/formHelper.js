const dateHelper = require("./dateHelper");
const prefectureHelper = require("./prefectureHelper");
const hashHelper = require("./hashHelper");

const CONVERT_KEY = {
	date_key: "moment",
	search_date_from: "moment",
	search_date_to: "moment",
	prefectures_field: "prefectures",
	password: "password",
	login_password: "password",
};

/**
 * formの特定のキーを持つプロパティに対して変換処理を行います。
 */
exports.converter = (formObject) => {
	Object.keys(formObject).forEach(key => {
		if(CONVERT_KEY[key]){
			switch(CONVERT_KEY[key]){
				case "moment":
					// 文字列(YYYY/DD/MM) -> moment
					formObject[key] = formObject[key] ? dateHelper.getDateToStr(formObject[key]) : "";
					break;
				case "prefectures":
					// 名称 -> ID

					break;
				case "tags":
					break;
				case "password":
				
					break;
			}
		}
	})
	return formObject
}
