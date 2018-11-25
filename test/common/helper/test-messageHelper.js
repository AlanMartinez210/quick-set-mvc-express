var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var messageHelper = require('../../../common/helper/messageHelper');

describe('messageHelper test', function() {
	it('IDを送って、正しい文言がリターンされていることを確認する'
	// , function(){
	// 	const msgJson = {
	// 		E00000: {msg: "エラーが発生しました。"},
	// 		E00001: {msg: "ログイン情報が間違っています"},
	// 		E00002: {msg: "この項目は必須入力です"},
	// 		E00003: {msg: "メールアドレス形式で入力してください"},
	// 		E00004: {msg: "パスワード形式で入力してください"},
	// 		E00005: {msg: "この項目は必須選択です"},
	// 		E00006: {msg: "項目内で選択してください"},
	// 		E00007: {msg: "日付形式で入力してください"},
	// 		M00002: {msg: "test2"},
	// 		M00003: {msg: "test2"},

	// 		L00001: {msg: "セッションが切断されました"},
	// 		L00002: {msg: "すでに依頼済みの募集です"},
	// 		L00003: {msg: "依頼の承諾に失敗しました"},
	// 		L00004: {msg: "この人にはレビューできません"},
	// 		L00005: {msg: "依頼の取消に失敗しました"},
	// 	}
	// 	const msgJson_Key = Object.keys(msgJson);

	// 	for(let i=0; i < msgJson_Key.length; i++) {
	// 		const checkID = msgJson_Key[i];
	// 		const checkWord =	msgJson[msgJson_Key[i]].msg;
	// 		// console.log('setting_ID:' + checkID);
	// 		// console.log('check_word:' + checkWord);
	// 		expect(messageHelper.getMsgObj(checkID).msg).to.be.equal(checkWord, "checkWrodが違います");
	// 	}
	// }
	);

	describe('messageHelper test errorパターン', function() {
		it('不正な値の場合は「require code」のエラーを出す', function(){
			(function() { messageHelper.getMsgObj(null) }).should.throw(Error, 'require code');
		});
	});

});
