const sessionHelper = require('../common/helper/sessionHelper');
const c2Util = require("../services/c2link4DiService");
const costumeVO = require("../viewObjects/costume");
const contentTitleService = require("../services/contentTitleService");
const contentCharaService = require("../services/contentCharaService");
const userContentRelationService = require("../services/userContentRelationService");


/**
 * コスプレ衣装設定画面の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	const render_obj = res.render_obj;

	render_obj.contentId = "costume";
	render_obj.title = "所持コスプレ衣装設定";
	render_obj.backBtn = c2Util.getBackMypageBtn();
	const user_id = sessionHelper.getUserId(req);

	// 所持衣装一覧の取得
	return userContentRelationService.getUserCostumeList(user_id)
	.then(costumeList=>{
		render_obj.bodyData = new costumeVO.costume_list(costumeList);
		res.render('mypage/costume', render_obj);
	})

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
	return contentTitleService.searchContentTitle({
		name: form_data.search_content_title,
	})
	.then(contentTitleList=>{
		const json_data = new costumeVO.content_title_obj(contentTitleList);
		res.json(json_data);
	});
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
	const user_id = sessionHelper.getUserId(req);

	// ユーザーの指定されたcostume_idから衣装情報を取得する。
	return userContentRelationService.getCostume(user_id, form_data.costume_id)
	.then(User_content_relation=>{
		const json_data = new costumeVO.costume_obj(User_content_relation);
		res.json(json_data);
	});
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
	const user_id = sessionHelper.getUserId(req);

	// フォームデータをもとに登録を行います。
	return userContentRelationService.addCostume(user_id, {
		content_id: form_data.conf_content_title,
		chara_id: form_data.conf_content_chara,
		remarks: form_data.costume_comment,
	})
	.then(()=>{
		res.status(200).json({});
	});
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
	const user_id = sessionHelper.getUserId(req);

	// フォームデータをもとに更新を行います。
	return userContentRelationService.updateCostume(user_id, {
		costume_id: form_data.costume_id,
		remarks: form_data.costume_comment,
	})
	.then(()=>{
		res.status(200).json({});
	});
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
	const user_id = sessionHelper.getUserId(req);

	return userContentRelationService.deleteCostume(user_id, {
		costume_id: form_data.costume_id,
	})
	.then(()=>{
		res.status(200).json({});
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
	;

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
	;

}
