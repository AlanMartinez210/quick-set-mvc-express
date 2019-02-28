const multer = require('multer');
const sampleImageService = require('../services/sampleImageService');
const userService = require("../services/userService");
const c2Util = require("../services/c2link4DiService");
const sessionHelper = require('../common/helper/sessionHelper');
const errorHelper = require('../common/helper/errorHelper');

const generalVO = require("../viewObjects/general");

/**
 * サンプル写真設定ページの表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
	var render_obj = res.render_obj;
	render_obj.contentId = "sample_image";
	render_obj.title = "サンプル写真設定";
	render_obj.backBtn = c2Util.getBackMypageBtn();
	
	// サンプル写真の取得
	const user_id = sessionHelper.getUserId(req);
	userService.getUserDataById(user_id)
	.then(instance => {
		render_obj.bodyData = new generalVO.userInfo(instance);
		res.render('mypage/sampleImage', render_obj);
	})
	.catch(err => {
		next(err);
	});
}

exports.deleteSampleImage = function(req, res, next){
	const form_data = req.form_data;
	const render_obj = res.render_obj;
  const user_id = sessionHelper.getUserId(req);

  sampleImageService.deleteSampleImage(user_id, form_data.sample_Image_name)
	.then(instance => {
		render_obj.bodyData = new generalVO.userInfo(instance);
		res.render('../content/mypage/sampleImage/sampleImageList', render_obj);
	})
	.catch(err => {
		next(err);
	});
}

/**
 * サンプル写真の登録
 *
 * @param {*} req
 * @param {*} res
 */
exports.postSampleImage = function(req, res, next){
	let imageUploader = multer({
		dest: `${__dirname}/../public/image/sampleimages`,
		limits: {
			fileSize: 1500000  // ファイルサイズ上限
		}
	}).any();
	
	imageUploader(req, res, err  => {
		if (err) {
			next(err);
			return false;
		}

		if(!req.files[0]){
			next(new errorHelper({ code: "E00018" }));
			return false;
		}

		const mimetype = req.files[0].mimetype
		const type = [
			{ ext: 'gif', mime: 'image/gif' },
			{ ext: 'jpg', mime: 'image/jpeg' },
			{ ext: 'png', mime: 'image/png' }
		].find(ext => {
			return ext.mime === mimetype;
		})

		if (!type) {
			next(new errorHelper({ status: 400, code: "E00018" }));
			return false;
		}

		const user_id = sessionHelper.getUserId(req);
		sampleImageService.registSampleImage(user_id, req.files[0].filename)
		.then(result => {
			imageUploader = null;
			res.json({ status: 'success' });
		})
		.catch(err => {
			next(err);
		});
	});
}