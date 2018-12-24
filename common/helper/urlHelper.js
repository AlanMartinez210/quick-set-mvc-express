
/**
 * JSONをURLパラメータに変換します。
 * 
 * @param {*} jsonParam 
 */
exports.jsonToUrlParam = (jsonParam) => {
	let param = "";
	let init = true;
	Object.keys(jsonParam).forEach(ele => {
		if(!jsonParam[ele]) return;	// この行いらない気がする

		const v = encodeURIComponent(jsonParam[ele]);
		if(init){
			param += `${ele}=${v}`;
			init = false;
		}
		else{
			param += `&${ele}=${v}`;
		}
	});
	return param;
}