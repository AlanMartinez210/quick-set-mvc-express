const c2Util = require("../services/c2link4DiService");

class equipmentItem {
	constructor(equipmentInfo){
		// 変換
		const equipment_type = c2Util.enumEquipmentType().getObj(equipmentInfo.get("equipment_type"));
		const maker_type = c2Util.enumMakerType().getObj(equipmentInfo.get("maker_type"));
		const use_year = c2Util.enumUseYearType().getObj(equipmentInfo.get("use_year"));

		this.equipment_type = equipment_type;
		this.maker_type = maker_type;
		this.maker_name = equipmentInfo.get("maker_name");
		this.equipment_name = equipmentInfo.get("equipment_name");
		this.use_year = use_year;
	}
}

module.exports = {
	hasEquipmentList: class {
		constructor(equipmentInfo = []){
			this.rows = equipmentInfo.map(v => {
				return new equipmentItem(v);
			})
		}
	},

	hasEquipment: class {
		constructor(equipmentInfo = {}){
			this.item = new equipmentItem(equipmentInfo);
		}
	}
}