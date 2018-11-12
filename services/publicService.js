const dateHelper = require('../common/helper/dateHelper');
const pageHelper = require('../common/helper/pageHelper');

const noticeRepository = require('../repository/noticeRepository')();

/**
 * お知らせデータ一覧を取得します。
 * 
 * @param {*} user_id 
 * @param {*} year 
 * @param {*} month 
 */
exports.getNoticeList = async ({islogin = true, target_year = "", now_page = 1}) => {

	// 返却データを宣言
	const notice_list_obj = {
		notice_list: [],
		pages: {}
	}

	// お知らせの総件数を取得
	const all_data_count = await noticeRepository.getDataCount(islogin, target_year);

	// お知らせデータの取得
	if(all_data_count){
		notice_list_obj.notice_list = await noticeRepository.getNoticeData(islogin, target_year, now_page)
		.then(res => {
			// 日付をmomentに変換
			res.forEach((ele, i) => {
				res[i].notice_date = dateHelper.getDate(ele.notice_date);
			});
			return res;
		})
	}
	
	notice_list_obj.pages = pageHelper.makePageObject(all_data_count, now_page, 5);

	return notice_list_obj;
}