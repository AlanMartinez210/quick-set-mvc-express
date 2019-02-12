const dateHelper = require("./dateHelper");
const prefectureHelper = require("./prefectureHelper");
const hashHelper = require("./hashHelper");

const CONVERT_KEY = {
	date_key: "moment",
	search_date_from: "moment",
	search_date_to: "moment",
	password: "password",
	prefecture: "prefecture",
	login_password: "password",
	allow_recruit_flg: "allow_recruit_flg:",
};

/**
 * formの特定のキーを持つプロパティに対して変換処理を行います。
 */
exports.converter = (formObject) => {
	console.log('formObject: ', formObject);
	Object.keys(formObject).forEach(key => {
		if(CONVERT_KEY[key] && formObject[key]){
			switch(CONVERT_KEY[key]){
				case "moment":
					// 文字列(YYYY/DD/MM) -> moment
					formObject[key] =  dateHelper.getDateToStr(formObject[key]);
					break;
				case "prefecture":
					// カメラマンの登録に合わせる。
					formObject.prefectures_field = [ formObject[key] ];
					delete formObject[key];
					break;
				case "tags":
					break;
				case "password":
					// パスワード -> ハッシュ化
					formObject[key] = hashHelper(formObject[key]);
					break;
				case "allow_recruit_flg:":
					formObject[key] = formObject[key].checked;
					break;
			}
		}
	})
	return formObject
}
