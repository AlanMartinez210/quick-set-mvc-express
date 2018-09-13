var crypto = require("crypto");

module.exports = (seeder) => {
	if(!seeder) throw new Error("invalid parameter");
	var sha256 = crypto.createHash('sha256');
	sha256.update(seeder);
	return sha256.digest('hex');
}