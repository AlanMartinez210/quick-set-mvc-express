module.exports = {
	/**
	 * 募集一覧
	 */
  recruit_list_page: class {
    constructor({
      recruit_list_item = [],
      recruit_list_pager = {
        count:0,
        now_page: 0,
        max_page: 0
      },
      recruit_search_info = {},
    }){

      this.recruit_list_arr = recruit_list_item;
      this.recruit_list_pager = recruit_list_pager;
      this.recruit_search_info = recruit_search_info;
    }
  },

  recruit_search_info: class {
    constructor({ shot_type = 0, search_date_from = ""/* moment */, search_date_to = ""/* moment */,
    prefectures_field = [], search_tag = ""}){

      this.shot_type = shot_type;
      this.search_date_from = search_date_from ? search_date_from.format("YYYY/MM/DD") : "",
      this.search_date_to = search_date_to ? search_date_to.format("YYYY/MM/DD") : "",
      this.prefectures_field = prefectures_field
      this.search_tag = search_tag
    }
  },

  /**
   * 募集一覧中身
   *
   * tags: 形式 [{ id: **, name: ** }, ...]
   * prefectures: 形式 [{ id: **, name: ** }, ...]
   */
  recruit_list_item: class {
    constructor({recruit_list_id = "", user_info = {id:0 ,icon:""}, date_info = {/* moment */},
                event_info = {type: [0, ""], title:"", prefectures:[]},
                good_review_num = 0, bookmark_flg = false, tags = [], anime_info = [] }){

      this.recruit_list_id = recruit_list_id;
      this.user_info = user_info;
      this.date_info = {
        key: date_info.format("YYYYMMDD"),
        year: date_info.year(),
        month: date_info.trueMonth(),
        day: date_info.date(),
        week: date_info.format('ddd'),
      }
      this.event_info = event_info;
      this.good_review_num = good_review_num;
      this.bookmark_flg = bookmark_flg;
      this.tags = tags;
      // this.anime_info = anime_info;
    }
  }
}
