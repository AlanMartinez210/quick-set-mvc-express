exports.formSetter = (form, obj) => {
	Object.keys(obj).forEach(ele => {
		form[ele] = obj[ele];
	});
	return form;
}

exports.viewObjectSetter = (view_object, ...objs) => {
	// 引数のオブジェクトの結合
	let target_object = {};
	objs.forEach(obj => {
		target_object = Object.assign(target_object, obj);
	})
	Object.keys(target_object).forEach(ele => {
		view_object[ele] = target_object[ele];
	});
	return view_object;
}