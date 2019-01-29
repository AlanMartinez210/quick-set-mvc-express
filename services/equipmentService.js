const db = require("../models/index");

exports.getEquipment = async(equipment_id) => {
	const result = db.Equipment.getEquipmentById(equipment_id);

	if(!result) return Promise.reject(new errorHelper({ code: "fatal" }));

	return result;
}

/**
 * 所持機材を更新
 *
 * @return {Number}
 */
exports.create = async(user_id, profileData) => {
	const values = {
		user_id : user_id,
		equipment_type : profileData.equipment_type,
		maker_type : profileData.maker_type,
		maker_name : profileData.maker_name,
		equipment_name : profileData.equipment_name,
		use_year : profileData.use_year,
  };

	return db.Equipment.createEquipment(values);
};
