const c2link4DiService = require("../services/c2link4DiService");
const enumShotType = c2link4DiService.enumShotType();
const enumPref = c2link4DiService.enumPref();

const urlHelper = require("../common/helper/urlHelper");
const pageHelper = require("../common/helper/pageHelper");
const prefectureHelper = require("../common/helper/prefectureHelper");

/**
 * 募集一覧中身
 *
 * user_info: 形式 {id: ** ,icon: **}
 * event_info: 形式 {shot_type: **, title: **, prefectures: **}
 * tags: 形式 [{ id: **, name: ** }, ...]
 * prefectures: 形式 [{ id: **, name: ** }, ...]
 */
class recruitListItem{
  constructor({recruit_list_id = "", user_info = {}, date_info = {/* moment */}, event_info = {},
              good_review_num = 0, bookmark_flg = false, tags = [], anime_info = [], prefectures=[] }){

    this.recruit_list_id = recruit_list_id;
    this.user_info = {
      id: user_info.id,
      icon : user_info.icon
    }
    this.date_info = {
      key: date_info.format("L"),
      year: date_info.year(),
      month: date_info.trueMonth(),
      day: date_info.date(),
      week: date_info.format('ddd'),
    }
    this.event_info = {
      shot_type: [enumShotType.getType(event_info.shot_type), enumShotType.getName(event_info.shot_type)],
      title: event_info.title,
      prefectures: event_info.prefectures,
    };
    this.good_review_num = good_review_num;
    this.bookmark_flg = bookmark_flg;
    this.tags = tags;
    // this.anime_info = anime_info;

  }
}

class recruitSearchInfo{
  constructor({ shot_type = "", search_date_from = ""/* moment */, search_date_to = ""/* moment */,
  prefectures_field = "", search_tag = ""}){

    this.enumPrefList = enumPref.getEnum();
    this.enumShotType = enumShotType.getEnum();
    this.shot_type = shot_type;
    this.shot_type = [],
    this.search_date_from = search_date_from ? search_date_from.format("L") : "";
    this.search_date_to = search_date_to ? search_date_to.format("L") : "";
    this.prefectures_field = prefectures_field;
    this.search_tag = search_tag;
  }
}



module.exports = {
	/**
	 * 募集一覧
	 */
  recruit_list_page: class {
    constructor( recruit_list, recruit_search_info = {page: 1}){
      this.recruit_list_arr = recruit_list.rows.map(schedule=>{
        return new recruitListItem({
          recruit_list_id: schedule.get("id"),
          user_info: schedule.get("user"),
          date_info: schedule.get("date_key"),
          event_info: {
            shot_type: schedule.get("shot_type_obj"),
            title: schedule.get("event_name"),
            prefectures: schedule.get("prefectures"),
          },
          bookmark_flg: true,
          tags: schedule.get("tags").map(v=>v.Tag),
          //anime_info: cos_chara,
        });
      });
      this.recruit_list_pager = pageHelper.makePageObject(recruit_list.count, recruit_search_info.page);

      this.recruit_search_info = new recruitSearchInfo({});
    }
  },

}
