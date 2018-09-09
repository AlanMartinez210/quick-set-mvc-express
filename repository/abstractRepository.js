const sequelize = require('../models/index').sequelize;

module.exports = (models)=>{
	return {
		getModel: ()=>{return models()},

		Sequelize: sequelize,

		findAll: (options = {}) => {
			options.raw = true;
			return models().findAll(options);
		},

		findOne: (options = {}) => {
			options.raw = true;
			return models().findOne(options);
		},

		create: (values, options = {})=>{
			options.raw = true;
			return models().create(values, options);
		},

		update: (values, options = {})=>{
			options.raw = true;
			return models().update(values, options);
		},

		bulkCreate: (records, options = {}) => {
			options.raw = true;
			return models().bulkCreate(records, options);
		},

		upsert: (values, options = {}) => {
			options.raw = true;
			return models().upsert(values, options);
		},

		destroy: (options = {}) => {
			return models().destroy(options);
		},

		querySelect: (sql, replacements = {} ,options = {}) =>{
			options.raw = true;
			options.replacements = replacements;
			options.type = sequelize.QueryTypes.SELECT;

			if(options.orderBy){
				sql += " order by ";
				sql += options.orderBy.map(obj=>{return obj[0] + " " + obj[1]}).join(",");
			}
			if(options.limit){
				sql += " limit " + options.limit;
			}
			if(options.offset){
				sql += " offset " + options.offset;
			}
			return sequelize.query(sql, options)
		},

		queryUpsert: (sql, replacements = {} ,options = {}) =>{
			options.raw = true;
			options.replacements = replacements;
			options.type = sequelize.QueryTypes.INSERT;
			return sequelize.query(sql, options)
		}

	};
}
