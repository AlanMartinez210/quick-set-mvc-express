module.exports = {
	/**
	 * 募集一覧
	 */
  recruit_list_page: class {
    constructor({
      recruit_list_item = [],
      recruit_list_pager = {/* pageObject */},
      recruit_search_info = {
        shot_type: 0,
        date_from: "",
        date_to: "",
        prefectures: [],
        tags: ""
      }
    }){

      this.recruit_list_arr = recruit_list_item;
      this.recruit_list_pager = recruit_list_pager;
      this.recruit_search_info = recruit_search_info;
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
                 event_info = {type: 0, title:"", prefectures:[]},
                 good_review_num = 0, bookmark_flg = false, tags = [], anime_info = [],
                 review_num = 0 }){

      this.recruit_list_id = recruit_list_id;
      this.user_info = user_info;
      this.date_info = {
        key: date_info.format("YYYYMMDD"),
        year: date_info.year(),
        month: date_info.trueMonth(),
        day: date_info.day(),
        week: date_info.format('ddd'),
      }
      this.event_info = event_info;
      this.good_review_num = good_review_num;
      this.bookmark_flg = bookmark_flg;
      this.tags = tags;
      this.anime_info = anime_info;
      this.review_num = review_num;
    }
  }
}
