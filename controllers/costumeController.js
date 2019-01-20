const sessionHelper = require('../common/helper/sessionHelper');
const c2Util = require("../services/c2link4DiService");
const costumeVO = require("../viewObjects/costume");

/**
 * コスプレ衣装設定画面の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	const render_obj = res.render_obj;

	render_obj.contentId = "costume";
	render_obj.title = "コスプレ衣装設定";
	render_obj.backBtn = c2Util.getBackMypageBtn();

	// 所持衣装一覧の取得

	render_obj.bodyData = new costumeVO.costume_list();

	res.render('mypage/costume', render_obj);
}

/**
 * 作品名の検索
 *
 * @param {*} req
 * @param {*} res
 */
exports.getContentTitle = function(req, res, next){
	const render_obj = res.render_obj;
	const form_data = req.form_data;

	// 作品タイトルとそれに付随するキャラクター情報を取得する。

	const jsonData = new costumeVO.content_title_obj();

	res.json(jsonData);
}

/**
 * コスチューム情報の取得
 *
 * @param {*} req
 * @param {*} res
 */
exports.getCostume = function(req, res, next){
	const render_obj = res.render_obj;
	const form_data = req.form_data;

	// ユーザーの指定されたcostume_idから衣装情報を取得する。
	const jsonData = new costumeVO.costume_obj();

	res.json(jsonData);
}

/**
 * コスプレ衣装新規登録
 *
 * @param {*} req
 * @param {*} res
 */
exports.postCreate = function(req, res, next){
	const render_obj = res.render_obj;
	const form_data = req.form_data;

	// フォームデータをもとに登録を行います。

	res.status(200).json({});
}

/**
 * コスプレ衣装更新
 *
 * @param {*} req
 * @param {*} res
 */
exports.putUpdate = function(req, res, next){
	const render_obj = res.render_obj;
	const form_data = req.form_data;
	console.log("edit");
	// フォームデータをもとに更新を行います。

	res.status(200).json({});

}

/**
 * コスプレ衣装削除
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = function(req, res, next){
	const render_obj = res.render_obj;
	const form_data = req.form_data;
	console.log("delete");
	res.status(200).json({});

}

/**
 * 作品の新規登録
 * 
 * @param {*} req
 * @param {*} res
 */
exports.createContentTitle = function(req, res, next){

	const render_obj = res.render_obj;
	const form_data = req.form_data;

	// 作品登録後、登録した作品情報を取得する。

	const json_data = new costumeVO.return_title_info();

	res.json(json_data);
}

/**
 * キャラクターの新規登録
 * 
 * @param {*} req
 * @param {*} res
 */
exports.createContentChara = function(req, res, next){

	const render_obj = res.render_obj;
	const form_data = req.form_data;

	// キャラクター登録後、登録したキャラクター情報を返却する。
	
	const json_data = new costumeVO.return_chara_info();
	res.json(json_data);
}