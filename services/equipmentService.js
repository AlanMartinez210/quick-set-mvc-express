const db = require("../models/index");

exports.getEquipment = async(equipment_id) => {
	const result = db.Equipment.getEquipmentById(equipment_id);

	if(!result) return Promise.reject(new errorHelper({ code: "fatal" }));

	return result;
}

/**
 * 所持機材を登録
 *
 * @return {Number}
 */
exports.create = async(user_id, equipmentData) => {
	const values = {
		user_id : user_id,
		equipment_type : equipmentData.equipment_type,
		maker_type : equipmentData.maker_type,
		maker_name : equipmentData.maker_name,
		equipment_name : equipmentData.equipment_name,
		use_year : equipmentData.use_year,
  };

	return db.Equipment.createEquipment(values);
};

/**
 * 所持機材を登録
 *
 * @param ユーザーID
 * @param 機材の詳細情報
 */
exports.create = async(user_id, equipmentData) => {
	const values = {
		user_id : user_id,
		equipment_type : equipmentData.equipment_type,
		maker_type : equipmentData.maker_type,
		maker_name : equipmentData.maker_name,
		equipment_name : equipmentData.equipment_name,
		use_year : equipmentData.use_year,
  };

	return db.Equipment.createEquipment(values);
};

/**
 * 所持機材を削除
 * @param ユーザーID
 * @param 機材ID
 */
exports.delete = async(user_id, equipment_id) => {
	return db.Equipment.delete(user_id, equipment_id);
};
