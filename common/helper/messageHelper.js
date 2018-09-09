const msgJson = {

	E00000: {msg: "エラーが発生しました。"},
	E00001: {msg: "ログイン情報が間違っています"},
	E00002: {msg: "この項目は必須入力です"},
	E00003: {msg: "メールアドレス形式で入力してください"},
	E00004: {msg: "パスワード形式で入力してください"},
	E00005: {msg: "この項目は必須選択です"},
	E00006: {msg: "項目内で選択してください"},
	E00007: {msg: "日付形式で入力してください"},
	M00002: {msg: "test2"},
	M00003: {msg: "test2"},
	M00004: {msg: "create, edit, deleteのいずれかにしてください"},

	L00001: {msg: "セッションが切断されました"},
	L00002: {msg: "すでに依頼済みの募集です"},
	L00003: {msg: "依頼の承諾に失敗しました"},
	L00004: {msg: "この人にはレビューできません"},
	L00005: {msg: "依頼の取消に失敗しました"},
}

exports.getMsgObj = (code) => {
	if(msgJson[code]){
		console.log(msgJson[code]);
		return msgJson[code];
	}
	else{
		console.error("code is undefined");
		return msgJson.E00000;
	}
}
