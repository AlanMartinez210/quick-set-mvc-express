const fs = require("fs");
const toml = require("toml");
module.exports = tomlPath => {
	const tomlData = fs.readFileSync(tomlPath, 'utf8');
	try{
		return toml.parse(tomlData);
	}catch(e){
		console.error(`Parsing error on line ${e.line}, column ${e.column} : ${e.messag}`);
		return {};
	}
}