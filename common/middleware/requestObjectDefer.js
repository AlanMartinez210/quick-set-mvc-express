module.exports = (req, res, next) =>{
	// req.form_dataを初期化しておきます。
	req.form_data = {};
	next();
}
