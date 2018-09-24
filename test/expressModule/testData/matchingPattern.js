const basePattern = require('./basePattern');
const abstractRepository = require('../../../repository/abstractRepository');

const matching = abstractRepository('Matching');
const schedule = abstractRepository('Schedule');
const chat = abstractRepository('Chat');

/**
 * #### マッチングパターン生成クラス
 * ##### このクラスはマッチング機能に特化して、DBデータの状態を生成します。
 * 
 *  - このクラスでは以下のユーザーが対象とされます。
 *    - user_id: 1, 5, 6
 * 
 *  - このクラスは以下の状態を再現します。
 *    - **スケジュール日を過ぎていない**
 *       - 未マッチング状態 -> case1
 *       - 未マッチングで、発言をしている状態 -> case2
 *       - マッチングが成立した状態 -> case3
 *       - マッチングがキャンセルされた状態 -> case4
 *       - 未マッチング状態(複数人) -> case5
 *       - マッチングが成立した状態(複数人) -> case6
 *    - **スケジュール日を過ぎている**
 *       - 未マッチング状態 -> case7
 *       - マッチングが成立した状態 -> case8
 *       - マッチングがキャンセルされた状態 -> case9
 *       - 未マッチング状態(複数人) -> case10
 *       - マッチングが成立した状態(複数人) -> case11
 * 
 * @class matchingPattern
 * @extends {basePattern}
 */
const matchingPattern = class extends basePattern {
  constructor(){
    super();
    // スケジュールデータ
    var future = new Date();
    var past = new Date();

    this.schedule_future = []
    for(var i=1;i<=6;i++){
      const d = {
        user_id: 1,
        schedule_type: 2,
        time_from: "10:00",
        time_to: "17:00",
        event_url: "htt://c2link.com/detail/event/test",
        shot_type: 1,
        cost: 1000,
        num: 1,
        remarks: "カメラマンテストスケジュール",
        event_name: "テストイベント" + i,
        date_key: future.setDate(future.getDate() + i)
      }
      this.schedule_future.push(d);
    }

    this.schedule_past = []
    for(var i=1;i<=5;i++){
      const d = {
        user_id: 1,
        schedule_type: 2,
        time_from: "10:00",
        time_to: "17:00",
        event_url: "htt://c2link.com/detail/event/test",
        shot_type: 1,
        cost: 1000,
        num: 1,
        remarks: "カメラマンテストスケジュール",
        event_name: "テストイベント" + i,
        date_key: past.setDate(past.getDate() - i)
      }
      this.schedule_past.push(d);
    }

    // マッチングケース1
    this.matching_data = [
      // case1
      { schedule_id: 1, user_id: 5, to_user_id: 1, status_id: 1},
      // case2
      { schedule_id: 2, user_id: 5, to_user_id: 1, status_id: 1},
      // case3
      { schedule_id: 3, user_id: 5, to_user_id: 1, status_id: 3},
      // case4
      { schedule_id: 4, user_id: 5, to_user_id: 1, status_id: 5},
      // case5
      { schedule_id: 5, user_id: 5, to_user_id: 1, status_id: 1},
      { schedule_id: 5, user_id: 6, to_user_id: 1, status_id: 1},
      // case6
      { schedule_id: 6, user_id: 5, to_user_id: 1, status_id: 3},
      { schedule_id: 6, user_id: 6, to_user_id: 1, status_id: 5},
      // case7
      { schedule_id: 7, user_id: 5, to_user_id: 1, status_id: 1},
      // case8
      { schedule_id: 8, user_id: 5, to_user_id: 1, status_id: 3},
      // case9
      { schedule_id: 9, user_id: 5, to_user_id: 1, status_id: 5},
      // case10
      { schedule_id: 10, user_id: 5, to_user_id: 1, status_id: 1},
      { schedule_id: 10, user_id: 6, to_user_id: 1, status_id: 1},
      // case11
      { schedule_id: 11, user_id: 5, to_user_id: 1, status_id: 3},
      { schedule_id: 11, user_id: 6, to_user_id: 1, status_id: 5},
    ]
    

    // マッチングケース2
    this.chat_data = [
      { matching_id: 2, user_id: 1, to_user_id: 5, message: "はじめまして、依頼していただきありがとうございます。", read_count: 0 },
      { matching_id: 2, user_id: 5, to_user_id: 1, message: "こちらこそ、撮影よろしくお願いします。", read_count: 0 },
      { matching_id: 2, user_id: 5, to_user_id: 1, message: "質問なのですが、スタンドライトでの撮影は可能でしょうか?", read_count: 0 },
    ]
  }

  /**
   * データを生成します。
   * 
   */
  genMatchingData(){
    return new Promise((resolve, reject) => {
      this.genUserAndTags()
      .then(res => {
        console.log("  -> matching data generating...")
        // スケジュールデータ(未来)を作成
        return schedule.bulkCreate(this.schedule_future);
      })
      .then(res => {
        // スケジュールデータ(過去)を作成
        return schedule.bulkCreate(this.schedule_past);
      })
      .then(res => {
        // マッチングデータを生成
        return matching.bulkCreate(this.matching_data);
      })
      .then(res => {
        // 発言を追加
        return chat.create(this.chat_data[0])
      })
      .then(res => {
        // 発言を既読に更新
        return Promise.all([
          chat.update({ read_flag: true }, { where: { matching_id: 1, seq_id: 1 } }),
        ])
      })
      .then(res => {
        // 発言を追加
        return chat.create(this.chat_data[1])
      })
      .then(res => {
        // 発言を既読に更新
        return Promise.all([
          chat.update({ read_flag: true }, { where: { matching_id: 1, seq_id: 2 } }),
        ])
      })
      .then(res => {
        // 発言を追加
        return chat.create(this.chat_data[2])
      })
      .then(res => {
        console.log("  -> complate!!");
        resolve(true);
      })
      .catch(err => {
        reject(err);
      })
    });
  }
}

module.exports = matchingPattern;