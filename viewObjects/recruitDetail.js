module.exports = {
  /**
   * 募集詳細
   * ※ ログインしている時に使用するviewObject
   * @param recruit_detail_arr [ schedule(user data), review ]
   */
  recruit_detail_item: class {
    constructor(recruit_detail_arr){
      const schedule = recruit_detail_arr[0];
      const review = recruit_detail_arr[1];
      const user = schedule.get('user');  // スケジュールを投稿したユーザー

      this.schedule_id = schedule.get("id");
      this.date_info = schedule.get("date_key").getDateInfo();
      this.time_from = schedule.get("time_from");
      this.time_to = schedule.get("time_to");
      this.shot_type = schedule.get("shot_type").name;
      this.event_name = schedule.get("event_name");
      this.event_url = schedule.get("event_url");
      this.cost = schedule.get("cost");
      this.num = schedule.get("num");
      this.remarks = schedule.get("remarks");
      this.tags = schedule.getArrTagByName;
      this.prefectures = schedule.prefectures;
      this.cos_chara = schedule.get("cos_chara");
      // ユーザーデータ
      this.user_name = user.get("user_name");
      this.icon_url = user.get("icon_url");
      this.bg_image_url = user.get("bg_image_url");
      
      this.good_review_num = user.get("good_review_num");
      this.bad_review_num = user.get("bad_review_num");
      this.review_list = review.rows.map(v => {
        return {
          review_type: v.get("review_type"),
          review_comments: v.get("review_comment")
        }
      });
      this.sample_image = user.get("sample_image");
    }
  },
}
