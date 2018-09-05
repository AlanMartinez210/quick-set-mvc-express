const abstractRepository = require('./abstractRepository');
const sequelize = require('../models/index').sequelize;
const Op = sequelize.Op;

const model = require('../models/tag');

var repo;
module.exports = () =>{
	// リポジトリは2回以上作成しない
	repo = repo || Object.assign(tagRepository, abstractRepository(model));
	return repo;
}


const tagRepository = {
	/**
	 * タグの登録を行う。
	 * 
	 * @param {*} tag_name 
	 */
	upsertTag(tag_name, options = {}){
		const sql = `INSERT INTO tags (tag_name, use_count, created_at, updated_at) VALUES (?, 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE use_count=use_count+1, updated_at=VALUES(updated_at);`;
		const replacements = [tag_name];
		return repo.queryUpsert(sql, replacements, options)
		.then(row => {
			return {tag_id: row[0]};
		})
	},
	/**
	 * タグのIDを取得する。
	 * 
	 * @param {Array} arr_tag_name 
	 */
	getTagRowByName(arr_tag_name, options = {}){
		options.where = {
			tag_name: {
				[Op.in]: arr_tag_name
			}
		};
		options.attributes = ['id', 'tag_name'];
		return repo.findAll(object);
	},
	/**
	 * IDからタグレコードを取得する。
	 * 
	 * @param {Array} arr_tag_id 
	 */
	getTagRowById(arr_tag_id, options = {}){
		options.where = {
			id: {
				[Op.in]: arr_tag_id
			}
		};
		options.attributes = ['id', 'tag_name'];
		return repo.findAll(options);
	}
}