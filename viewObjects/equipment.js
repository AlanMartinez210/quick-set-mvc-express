module.exports = {
	equipmentInit: class {
		constructor(equipmentInfo = {}){
			this.equipment_type = equipmentInfo.equipment_type;
			this.maker_type = equipmentInfo.maker_type;
			this.maker_name = equipmentInfo.maker_name;
			this.equipment_name = equipmentInfo.equipment_name;
			this.use_year = equipmentInfo.use_year;
		}
	}
}