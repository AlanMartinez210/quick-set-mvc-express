module.exports = {
  /**
   * 募集詳細
   * ※ ログインしている時に使用するviewObject
   * @param Schedule
   */
  recruit_detail_item: class {
    constructor(Schedule = {}){
      const user = Schedule.get('user');  // スケジュールを投稿したユーザー
      this.schedule_id = Schedule.get("id");
      this.date_info = Schedule.get("date_key").getDateInfo();
      this.time_from = Schedule.get("time_from");
      this.time_to = Schedule.get("time_to");
      this.shot_type = Schedule.get("shot_type").name;
      this.event_name = Schedule.get("event_name");
      this.event_url = Schedule.get("event_url");
      this.cost = Schedule.get("cost");
      this.num = Schedule.get("num");
      this.remarks = Schedule.get("remarks");
      this.tags = Schedule.getArrTagByName;
      this.prefectures = Schedule.prefectures;
      this.cos_chara = Schedule.get("cos_chara");
      // ユーザーデータ
      this.user_name = user.get("user_name");
      this.icon_url = user.get("icon_url");
      this.bg_image_url = user.get("bg_image_url");
      this.good_review_num = user.get("good_review_num");
      this.bad_review_num = user.get("bad_review_num");
      this.review_list = [
        { review_type: 1, review_comments: "よくできました。"},
        { review_type: 2, review_comments: "ダメでした。"}
      ];
      this.sample_image = [];
    }
  },
}
