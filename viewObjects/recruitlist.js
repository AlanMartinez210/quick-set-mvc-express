module.exports = {
	/**
	 * 募集一覧
	 */
  recruit_list_page: class {
    constructor({recruit_list_item = [], recruit_list_pager = {/* pageObject */}}){
      this.recruit_list_arr = recruit_list_item;
      this.recruit_list_pager = recruit_list_pager;
    }
  },

  /**
   * 募集一覧中身
   */
  recruit_list_item: class {
    constructor({recruit_list_id = "", user_info = {id:0,icon:""}, date_info = {/* dateHelper.dateToObject */},
                 event_info = {type: 0, title:"", prefectures:[]},
                 good_review_num = 0, bookmark_flg = false, tags = [], anime_info = [] }){
      this.recruit_list_id = recruit_list_id;
      this.user_info = user_info;
      this.date_info = date_info;
      this.event_info = event_info;
      this.good_review_num = good_review_num;
      this.bookmark_flg = bookmark_flg;
      this.tags = tags;
      this.anime_info = anime_info;
    }
  }
}
