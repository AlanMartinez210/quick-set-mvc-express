const db = require('../models/index');


module.exports = (models_name) => {
	return {
		getModel: () => {return models_name ? db[models_name] : undefined },

		Sequelize: db.sequelize,
		Op: db.sequelize.Op,

		/**
		 * findAll(options: Object): Promise<Array<Model>>
		 */
		findAll: (options = {}) => {
			options.raw = true;
			return db[models_name].findAll(options);
		},

		/**
		 * findOne(options: Object): Promise<Model>
		 */
		findOne: (options = {}) => {
			options.raw = true;
			return db[models_name].findOne(options);
		},

		/**
		 * findById(id: Number | String | Buffer, options: Object): Promise<Model>
		 */
		findById: (key_id, options = {}) => {
			options.raw = true;
			return db[models_name].findById(key_id, options);
		},

		/**
		 * count(options: Object): Promise<Integer>
		 */
		count: (options = {}) => {
			options.raw = true;
			return db[models_name].count(options);
		},

		/**
		 * create(values: Object, options: Object): Promise<Model>
		 */
		create: (values, options = {})=>{
			return db[models_name].create(values, options)
			.then(res => {
				return res.dataValues;
			});
		},

		/**
		 * update(values: Object, options: Object): Promise<Array<affectedCount, affectedRows>>
		 */
		update: (values, options = {})=>{
			return db[models_name].update(values, options);
		},

		/**
		 * bulkCreate(records: Array, options: Object): Promise<Array<Model>>
		 */
		bulkCreate: (records, options = {}) => {
			return db[models_name].bulkCreate(records, options)
			.then(res => {
				return res.map(o => { return o.dataValues; })
			});
		},

		/**
		 * upsert(values: Object, options: Object): Promise<created>
		 */
		upsert: (values, options = {}) => {
			return db[models_name].upsert(values, options);
		},

		/**
		 * public static destroy(options: Object): Promise<Integer>
		 */
		destroy: (options = {}) => {
			return db[models_name].destroy(options);
		},

		querySelect: (sql, replacements = {} ,options = {}) =>{
			options.raw = true;
			options.replacements = replacements;
			options.type = db.sequelize.QueryTypes.SELECT;

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
			return db.sequelize.query(sql, options);
		},

		queryUpsert: (sql, replacements = {} ,options = {}) =>{
			options.raw = true;
			options.replacements = replacements;
			options.type = db.sequelize.QueryTypes.INSERT;
			return db.sequelize.query(sql, options)
		}

	};
}
