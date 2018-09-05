var crypto = require("crypto");

module.exports = (sring)=>{
	var sha256 = crypto.createHash('sha256');
	sha256.update(sring);
	return sha256.digest('hex');
}