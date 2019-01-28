const equipmentService = require("../services/equipmentService");
const equipmentVO = require("../viewObjects/equipment");
const sessionHelper = require('../common/helper/sessionHelper');
const c2Util = require("../services/c2link4DiService");

/**
 * 所持機材登録の画面表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	const render_obj = res.render_obj;

	render_obj.contentId = "equipment";
	render_obj.title = "所持機材設定";
	render_obj.backBtn = c2Util.getBackMypageBtn();
	const user_id = sessionHelper.getUserId(req);

	res.render('mypage/equipment', render_obj);

}

/**
 * 所持機材登録の画面表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.getEquipmentList = function(req, res, next){
	const render_obj = res.render_obj;
	const user_id = sessionHelper.getUserId(req);

	res.json({status:'success'});

}

/**
 * 機材の登録
 *
 * @param {*} req
 * @param {*} res
 */
exports.postCreate = function(req, res, next){
	// res.json({status:'success'});

	const form_data = req.form_data;
	const user_id  = sessionHelper.getUserId(req);
	//ユーザーIDをセッションから取得
	equipmentService.create(user_id, form_data)
		.then(results => {
			res.json({
				status: 'success'
			});
		}).catch(err => {
			next(err);
		});
}

/**
 * 機材の更新
 *
 * @param {*} req
 * @param {*} res
 */
exports.putUpdate = function(req, res, next){

	const render_obj = res.render_obj;
	const form_data = req.form_data;

	res.json({status:'success'});

}

/**
 * 機材の削除
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = function(req, res, next){

	const render_obj = res.render_obj;
	const form_data = req.form_data;

	res.json({status:'success'});

}