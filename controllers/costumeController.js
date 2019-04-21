const sessionHelper = require('../common/helper/sessionHelper');
const c2Util = require("../services/c2link4DiService");
const costumeVO = require("../viewObjects/costume");
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
	.catch(err=>{
		next(err);
	});
}

/**
 * ユーザーの所持コスプレ衣装一覧の取得
 *
 * @param {*} req
 * @param {*} res
 */
exports.list = function(req, res, next){
	const user_id = sessionHelper.getUserId(req);

	// 所持衣装一覧の取得
	return userContentRelationService.getUserCostumeList(user_id)
	.then(costumeList=>{
		console.log('costumeList: ', costumeList);
		const json_data = new costumeVO.costume_list(costumeList);
		res.json(json_data);
	})
	.catch(err=>{
		next(err);
	});
}

/**
 * コスチューム情報の取得
 *
 * @param {*} req
 * @param {*} res
 */
exports.getCostume = function(req, res, next){
	const form_data = req.form_data;

	// costume_idから衣装情報を取得する。
	return userContentRelationService.getCostumeById(form_data.costume_id)
	.then(User_content_relation=>{
		const json_data = new costumeVO.costume_info(User_content_relation);
		res.json(json_data);
	})
	.catch(err=>{
		next(err);
	});
}


/**
 * コスプレ衣装新規登録
 *
 * @param {*} req
 * @param {*} res
 */
exports.postCreate = function(req, res, next){
	const form_data = req.form_data;
	const user_id = sessionHelper.getUserId(req);

	// フォームデータをもとに登録を行います。
	return userContentRelationService.addCostume(user_id, {
		chara_id: form_data.conf_chara_id,
		remarks: form_data.costume_comment,
	})
	.then(() => {
		// 所持衣装一覧の取得
		return userContentRelationService.getUserCostumeList(user_id)
	})
	.then(costumeList => {
		const json_data = new costumeVO.costume_list(costumeList);
		res.json(json_data);
	})
	.catch(err=>{
		next(err);
	});
}

/**
 * コスプレ衣装更新
 *
 * @param {*} req
 * @param {*} res
 */
exports.putUpdate = function(req, res, next){
	const form_data = req.form_data;
	const user_id = sessionHelper.getUserId(req);

	// フォームデータをもとに更新を行います。
	return userContentRelationService.updateCostume(user_id, {
		costume_id: form_data.costume_id,
		remarks: form_data.costume_comment,
	})
	.then(() => {
		// 所持衣装一覧の取得
		return userContentRelationService.getUserCostumeList(user_id)
	})
	.then(costumeList => {
		const json_data = new costumeVO.costume_list(costumeList);
		res.json(json_data);
	})
	.catch(err=>{
		next(err);
	});
}

/**
 * コスプレ衣装削除
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = function(req, res, next){
	const form_data = req.form_data;
	const user_id = sessionHelper.getUserId(req);

	return userContentRelationService.deleteCostume(user_id, {
		costume_id: form_data.costume_id,
	})
	.then(() => {
		// 所持衣装一覧の取得
		return userContentRelationService.getUserCostumeList(user_id)
	})
	.then(costumeList => {
		const json_data = new costumeVO.costume_list(costumeList);
		res.json(json_data);
	})
	.catch(err=>{
		next(err);
	});
}