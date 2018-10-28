module.exports = {
  
  /**
   * 募集詳細
   * ※ ログインしている時に使用するviewObject
   * 
   */
  recruit_detail_item: class {
    constructor({ 
      user_info = {id: 0, name: "", icon: ""},
      date_info = {/* moment */},
      event_info = {type: 0, title: "", prefectures: []},
      good_review_num = 0,
      tags = []
    }){

      this.user_info = user_info;
      this.date_info = {
        key: date_info.format("YYYYMMDD"),
        year: date_info.year(),
        month: date_info.trueMonth(),
        day: date_info.day(),
        week: date_info.format('ddd'),
      };
      this.event_info = event_info;
      this.good_review_num = good_review_num;
      this.tags = tags;
      this.remarks = remarks;
    }
  }

}

