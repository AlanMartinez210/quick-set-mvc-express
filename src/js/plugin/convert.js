export default class convert{
	constructor(){}
	serverDate(date_key){
		if(!date_key) return "";
		return date_key.slice(0,4) + date_key.slice(5,7) + date_key.slice(8,10);
	}

	jsonToUrlParam(jsonParam){
		let param = "";
		Object.keys(jsonParam).forEach((ele, i) => {
			if(!i){
				param += `?${ele}=${jsonParam[ele]}`;
			}
			else{
				param += `&${ele}=${jsonParam[ele]}`;
			}
		});
		param = encodeURI(param);
		return param;
	}
}