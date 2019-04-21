const sessionHelper = require('../common/helper/sessionHelper');
const c2Util = require("../services/c2link4DiService");
const contentService = require("../services/contentService");
const contentVO = require("../viewObjects/content");

/**
 * 作品/キャラクターの取得
 *
 * @param {*} req
 * @param {*} res
 */
exports.info = function(req, res, next){
	const form_data = req.form_data;
	let [results, vo] = [];
	
	if(c2Util.isTitle(form_data.type)){
		vo = contentVO.title_info;
		results = contentService.getTitle(form_data.id)
	}
	else{
		vo = contentVO.chara_info;
		results = contentService.getChara(form_data.id)
	}

	return results
	.then(instance => {
		const json_data = new vo(instance);
		res.json(json_data);
	})
	.catch(err => next(err));
}

/**
 * 作品情報を検索します。
 *
 * @param {*} req
 * @param {*} res
 */
exports.search = function(req, res, next){
	const form_data = req.form_data;
	let [results, vo] = [];

	if(c2Util.isTitle(form_data.type)){
		results = contentService.searchContentTitle(form_data.keyword);
	}else{
		// vo = contentVO;
		results = contentService.searchContentChara(form_data.keyword);
	}

	results
	.then(instance => {
		const json_data = new contentVO.search_results(instance);
		console.log('json_data: ', json_data);
		res.json(json_data);
	})
	.catch(err => {
		next(err);
	});
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
	const user_id = sessionHelper.getUserId(req);

	// 作品登録後、登録した作品情報を取得する。
	return contentTitleService.addContentTitle(user_id, {
		name: form_data.content_title,
		sub_title: form_data.content_sub_title,
		abbreviation: form_data.content_abbreviation,
	})
	.then(content_title=>{
		return contentTitleService.getContentTitle(content_title.get("id"))
		.then(content_title=>{
			const json_data = new costumeVO.return_title_info(content_title);
			res.json(json_data);
		});
	})
	.catch(err=>{
		next(err);
	});

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
	const user_id = sessionHelper.getUserId(req);

	// キャラクター登録後、登録したキャラクター情報を返却する。
	return contentCharaService.addChara(user_id, {
		content_id: form_data.conf_content_title,
		name: form_data.content_chara,
	})
	.then(content_chara=>{
		const json_data = new costumeVO.return_chara_info(content_chara);
		res.json(json_data);
	})
	.catch(err=>{
		next(err);
	});

}

/**
 * 作品情報を取得します。
 *
 * @param {*} req
 * @param {*} res
 */
exports.update = function(req, res, next){
	const form_data = req.form_data;
}

/**
 * 作品情報を取得します。
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = function(req, res, next){
	const form_data = req.form_data;
}

