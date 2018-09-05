

/**
 * レスポンス情報にcontent idやtitleなどのページ情報を設定します。
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = (req, res, next) => {

	if(req.method === "GET"){
		// console.log(req.url);
		// res.render_obj.contentId = "";
		// res.render_obj.title = "";
	}
	next();
}