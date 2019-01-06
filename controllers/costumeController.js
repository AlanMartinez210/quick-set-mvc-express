const sessionHelper = require('../common/helper/sessionHelper');
const c2Util = require("../services/c2link4DiService");

/**
 * コスプレ衣装設定画面の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	const render_obj = res.render_obj;
	const form_data = req.form_data;

	render_obj.contentId = "costume";
	render_obj.title = "コスプレ衣装設定";
	render_obj.backBtn = c2Util.getBackMypageBtn();
	const user_id = sessionHelper.getUserId(req);

	res.render('mypage/costume', render_obj);

}

/**
 * コスプレ衣装新規登録
 *
 * @param {*} req
 * @param {*} res
 */
exports.postCreate = function(req, res, next){

	const render_obj = res.render_obj;
	render_obj.contentId = "costume";

	res.render('mypage/costume', render_obj);

}

/**
 * コスプレ衣装更新
 *
 * @param {*} req
 * @param {*} res
 */
exports.putUpdate = function(req, res, next){

	const render_obj = res.render_obj;
	render_obj.contentId = "costume";
	const user_id = sessionHelper.getUserId(req);

	res.render('mypage/costume', render_obj);

}

/**
 * コスプレ衣装削除
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = function(req, res, next){

	const render_obj = res.render_obj;
	render_obj.contentId = "costume";
	const user_id = sessionHelper.getUserId(req);

	res.render('mypage/costume', render_obj);

}

/**
 * 作品の新規登録
 * 
 * @param {*} req
 * @param {*} res
 */
exports.createContentTitle = function(req, res, next){



}

/**
 * キャラクターの新規登録
 * 
 * @param {*} req
 * @param {*} res
 */
exports.createContentChara = function(req, res, next){



}