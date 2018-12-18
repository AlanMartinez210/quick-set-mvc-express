const c2link4DiService = require("../services/c2link4DiService");

const urlHelper = require("../common/helper/urlHelper");
const pageHelper = require("../common/helper/pageHelper");
const prefectureHelper = require("../common/helper/prefectureHelper");

const _ = require("lodash");

/**
 * 募集一覧中身
 *
 * user_info: 形式 {id: ** ,icon: **}
 * event_info: 形式 {shot_type: **, title: **, prefectures: **}
 * tags: 形式 [{ id: **, name: ** }, ...]
 * prefectures: 形式 [{ id: **, name: ** }, ...]
 */
class recruitListItem{
  constructor(schedule = {}){
    const user_info = schedule.get("user");
    const date_info = schedule.get("date_key");

    this.schedule_id = schedule.get("id");

    this.user_info = {
      id: user_info.id,
      icon: user_info.icon
    };

    this.date_info = {
      key: date_info.format("L"),
      year: date_info.year(),
      month: date_info.trueMonth(),
      day: date_info.date(),
      week: date_info.format('ddd')
    };

    this.event_info = {
      shot_type: schedule.get("shot_type"),
      title: schedule.get("event_name"),
      prefectures: schedule.get("prefectures"),
    }

    this.bookmark_flg = true;
    this.tags = schedule.get("tags") && schedule.get("tags").map(v=>v.Tag);
    this.good_review_num = user_info.get("good_review_num")
    this.anime_info = {}; //anime_info;
  }
}

/**
 * 検索結果の挿入 -> 基本リクエストの値をそのまま設定する。
 */
class recruitSearchInfo{
  constructor(info){
    // shot_type＿objに変換
    this.shot_type = info.shot_type && c2link4DiService.enumShotType().getObj(info.shot_type);
    
    this.search_date_from = info.search_date_from && info.search_date_from.format("L");
    this.search_date_to = info.search_date_to && info.search_date_to.format("L");

    // 変換
    let pref = info.prefectures_field || [];
    this.prefectures_field = pref.map(v => {
      return {pref_id: v, pref_name: prefectureHelper.getPrefectureNameById(v)}
    });

    this.search_tag = info.search_tag || "";

    // コピーして使う
    const copy = Object.assign({}, info)
    delete copy.page
    this.search_url_param = urlHelper.jsonToUrlParam(copy);
  }
}

module.exports = {
	/**
	 * 募集一覧
	 */
  recruit_list_page: class {
    constructor(recruit_list, recruit_search_info = {page: 1}){
      console.log('recruit_search_info: ', recruit_search_info);

      this.recruit_list_arr = recruit_list.rows.map(schedule => new recruitListItem(schedule));
      this.recruit_list_pager = pageHelper.makePageObject(recruit_list.count, recruit_search_info.page);
      this.recruit_search_info = new recruitSearchInfo(recruit_search_info);
    }
  }

}
