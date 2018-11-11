const dateHelper = require("./dateHelper");

const CONVERT_KEY = {
	date_key: "moment",
	search_date_from: "moment",
	search_date_to: "moment"
};

/**
 * formの特定のキーを持つプロパティに対して変換処理を行います。
 */
exports.converter = (formObject) => {
	Object.keys(formObject).forEach(key => {
		if(CONVERT_KEY[key]){
			switch(CONVERT_KEY[key]){
				case "moment":
					formObject[key] = formObject[key] ? dateHelper.getDateToStr(formObject[key]) : "";
					break;
			}
		}
	})
	return formObject
}
