module.exports = {
  /**
   * 募集詳細
   * ※ ログインしている時に使用するviewObject
   *
   */
  recruit_detail_item: class {
    constructor(Schedule /** getSchedule **/){
      const schedule = Schedule;  // スケジュール
      const user = schedule.get('User');  // スケジュールを投稿したユーザー
    }
  },
}
