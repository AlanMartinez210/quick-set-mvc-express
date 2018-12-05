const dateHelper = require("../common/helper/dateHelper");

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Notice = sequelize.define('Notice', {
    notice_date: {
      type: DataTypes.DATE,
      field: "notice_date",
      get(){
        return dateHelper.getDate(this.getDataValue('notice_date'));
      },
      set(v){
        return this.setDataValue('notice_date', v.toDate())
      }
    },
    type: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    islogin: DataTypes.INTEGER,
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    },
    timestamps: false
  });

  
  /**
   * お知らせデータを取得する。
   * 
   * @param {*} isLogin true: ログインユーザーのみのお知らせ
   * @param {*} target_year 
   * @param {*} now_page 
   * @param {*} options 
   */
  Notice.getNoticeData = function(isLogin = true, target_year = "", now_page = 1, options = {}){
		options.where = {
			[sequelize.Op.and]: getWhere(sequelize, isLogin, target_year)
		};
		options.limit = 5;
		options.offset = (now_page - 1) * 5;

		return this.findAll(options);
  };

  /**
   * お知らせの総件数を取得する。
   * 
   * @param {*} isLogin true: ログインユーザーのみのお知らせ
   * @param {*} target_year 
   * @param {*} options 
   */
	Notice.getDataCount = function(isLogin = true, target_year = "", options = {}){
		options.where = {
			[sequelize.Op.and]: getWhere(sequelize, isLogin, target_year)
		};
		return this.count(options);
	};

  return Notice;
};

/**
 * 共通where文を作成し、返却します。
 * 
 * @param {*} isLogin 
 * @param {*} target_year 
 */
function getWhere(sequelize, isLogin, target_year){
	const where = [];

	// 未ログインの項目だけ取得する。
	if(!isLogin) where.push({islogin: 0});
	// 指定日付移行のものを取得する。
	if(target_year){
		where.push({
			notice_date: {
				[sequelize.Op.between]: [
					dateHelper.createDate(target_year, 1, 1).toDate(),
					dateHelper.createDate((target_year + 1), 1, 1).toDate()
				]
			}
		}); 
  }

  return where;
}
