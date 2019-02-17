const dateHelper = require("./dateHelper");
const prefectureHelper = require("./prefectureHelper");
const hashHelper = require("./hashHelper");

const CONVERT_KEY = {
	date_key: "moment",
	search_date_from: "moment",
	search_date_to: "moment",
	password: "password",
	prefecture: "prefecture",
	prefectures_field: "prefectures_field",
	login_password: "password",
	costume_field: "costume_field"
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
					formObject.prefectures_field = [ Number(formObject[key]) ];
					delete formObject[key];
					break;
				case "prefectures_field":
					formObject.prefectures_field = formObject[key].map(v => Number(v.prefecture_id));
					break;
				case "tags":
					break;
				case "password":
					// パスワード -> ハッシュ化
					formObject[key] = hashHelper(formObject[key]);
					break;
				case "costume_field":
					formObject.cos_chara = formObject[key].map(v => Number(v.costume_id));
			}
		}
	})
	return formObject
}
