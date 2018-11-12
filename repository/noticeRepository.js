var abstractRepository = require('./abstractRepository');
var dateHelper = require('../common/helper/dateHelper');

var repo;
module.exports = () =>{
	// リポジトリは2回以上作成しない
	repo = repo || Object.assign(noticeRepository, abstractRepository("Notice"))
	return repo;
}

const noticeRepository = {
	/**
	 * お知らせデータを取得する。
	 */
	getNoticeData: (isLogin = true, target_year = "", now_page = 1, options = {}) => {
		options.where = {
			[repo.Op.and]: getWhere(isLogin, target_year)
		};
		options.limit = 5;
		options.offset = (now_page - 1) * 5;

		console.log(options);

		return repo.findAll(options);
	},

	/**
	 * お知らせの総件数を取得する。
	 */
	getDataCount: (isLogin = true, target_year = "", options = {}) => {
		options.where = {
			[repo.Op.and]: getWhere(isLogin, target_year)
		};
		return repo.count(options);
	}
};

/**
 * 共通where文を作成し、返却します。
 * 
 * @param {*} isLogin 
 * @param {*} target_year 
 */
function getWhere(isLogin, target_year){
	const where = [];

	// 未ログインの項目だけ取得する。
	if(!isLogin) where.push({islogin: 0});
	// 指定日付移行のものを取得する。
	if(target_year){
		where.push({
			notice_date: {
				[repo.Op.between]: [
					dateHelper.createDate(target_year, 1, 1).toDate(),
					dateHelper.createDate((target_year + 1), 1, 1).toDate()
				]
			}
		}); 
	} 

	return where;
}
