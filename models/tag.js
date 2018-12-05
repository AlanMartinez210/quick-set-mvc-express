'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tag = sequelize.define('Tag', {
    tag_name: DataTypes.STRING,
    use_count: DataTypes.INTEGER
  }, {
    timestamps: false
  });

  /**
	 * タグの登録を行う。
	 * 既に存在するタグの場合はuse_countを+1する。
	 * 
	 * @param {*} tag_name 
	 * @return insertまたはupdateしたタグのID
	 */
	Tag.upsertTag = function(tag_name, options = {}){
		const sql = `INSERT INTO tags (tag_name, use_count, created_at, updated_at) VALUES (?, 1, NOW(), NOW()) ON DUPLICATE KEY UPDATE use_count=use_count+1, updated_at=VALUES(updated_at);`;
		options.replacements = [tag_name];
		options.type = sequelize.QueryTypes.INSERT;
		return sequelize.query(sql, options)
		.then(v => { return {tag_id: v[0]} });
	};
  
  /**
	 * タグ名からタグレコードを取得する。
	 * 
	 * @param {Array} arr_tag_name 
	 */
	Tag.getTagByName = function(arr_tag_name, options = {}){
		options.where = {
			tag_name: {
				[sequelize.Op.in]: arr_tag_name
			}
		};
		return this.findAll(options);
  };

  /**
	 * IDからタグレコードを取得する。
	 * 
	 * @param {Array} arr_tag_id 
	 */
	Tag.getTagById = function(arr_tag_id, options = {}){
		options.where = {
			id: {
				[sequelize.Op.in]: arr_tag_id
			}
		};
		return this.findAll(options);
	};
  
  return Tag;
};
