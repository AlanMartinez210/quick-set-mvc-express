const equipmentService = require("../services/equipmentService");
const equipmentVO = require("../viewObjects/equipment");
const sessionHelper = require('../common/helper/sessionHelper');
const db = require('../models/index');
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

	db.Equipment.getEquipmentListByUserId(user_id)
	.then(instances => {
		render_obj.bodyData = new equipmentVO.hasEquipmentList(instances);
		res.render('mypage/equipment', render_obj);
	})
	.catch(err => {
		next(err);
	})
}

/**
 * 所持機材一覧の取得
 *
 * @param {*} req
 * @param {*} res
 */
exports.getEquipmentList = function(req, res, next){
	const render_obj = res.render_obj;
	const user_id = sessionHelper.getUserId(req);

	db.Equipment.getEquipmentListByUserId(user_id)
	.then(instances => {
		render_obj.bodyData = new equipmentVO.hasEquipmentList(instances);
		res.render('../content/mypage/schedule/calendarSection', render_obj);
	})
	.catch(err => {
		next(err);
	});
}

/**
 * 所持機材の取得
 *
 * @param {*} req
 * @param {*} res
 */
exports.getEquipment = function(req, res, next){
	const form_data = req.form_data;

	equipmentService.getEquipment(form_data.equipment_id)
	.then(instance => {
		const json_data = new equipmentVO.hasEquipment(instance);
		res.json(json_data);
	})
	.catch(err => {
		next(err);
	});
}

/**
 * 機材の登録
 *
 * @param {*} req
 * @param {*} res
 */
exports.postCreate = function(req, res, next){

	const form_data = req.form_data;
	const user_id  = sessionHelper.getUserId(req);
	//ユーザーIDをセッションから取得
	equipmentService.create(user_id, form_data)
		.then(results => {
			console.log('results: ', results);
			res.json({ status: 'success' });
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