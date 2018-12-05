module.exports = {

  /**
   * 募集詳細
   * ※ ログインしている時に使用するviewObject
   *
   */
  recruit_detail_item: class {
    constructor({
      recruit_list_id = "",
      bgImage = "",
      good_review_num = 0,
      bad_review_num = 0,
      user_info = {id: 0, name: "", icon: ""},
      date_info = {/* moment */},
      event_info = {shot_type: 0, title: "", url: "", prefectures: [], tags: []},
      review_info = [],
      user_tags = [],
      remarks = ""
    }){
      this.recruit_list_id = recruit_list_id;
      this.bgImage = bgImage;
      this.good_review_num = good_review_num;
      this.bad_review_num = bad_review_num;
      this.user_info = user_info;
      this.date_info = {
        key: date_info?date_info.format("L"):"",
        year: date_info?date_info.year():"",
        month: date_info?date_info.trueMonth():"",
        day: date_info?date_info.date():"",
        week: date_info?date_info.format('ddd'):"",
      };
      this.event_info = event_info;
      this.review_info = review_info;
      this.user_tags = user_tags;
      this.remarks = remarks;
    }
  }

}
