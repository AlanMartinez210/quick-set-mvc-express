const basePattern = require('./basePattern');
const db = require("../../../models/index");

const dateHelper = require('../../../common/helper/dateHelper');

// 基本的なテストを行うためのテストデータを作成します。


/**
 * #### レビューパターン生成クラス
 * ##### このクラスはレビュー機能に特化して、DBデータの状態を生成します。
 * 
 *  - このクラスでは以下のユーザーが対象とされます。
 *    - user_id: 1, 5
 *  - このクラスでは以下のマッチングが対象とされます。
 *    - matching_id: 7
 * 
 *  - このクラスは以下の状態を再現します。
 *    - ユーザー1(主)とユーザー5(相手)がそれぞれ未レビューの状態 -> case1(両者未レビューのためレビューデータなし))
 *    - ユーザー1(主)のみレビュー -> case2
 *    - ユーザー5(相手)のみレビュー -> case3
 *    - 両者レビュー -> case4
 * 
 * @class reviewPattern
 * @extends {basePattern}
 */
const reviewPattern = class extends basePattern {
  constructor(){
    super();

    // スケジュールデータ(レビューするために過去のものを作る)
    this.review_schedule_data = []
    for(var i=1;i<=4;i++){
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
        event_name: "テストイベント",
        date_key: dateHelper.createDate(2018, 8, i)
      }
      this.review_schedule_data.push(d);
    }

    // マッチングデータ
    this.review_matching_data = [
      { schedule_id: 1, user_id: 5, to_user_id: 1, status_id: 3},
      { schedule_id: 2, user_id: 5, to_user_id: 1, status_id: 3},
      { schedule_id: 3, user_id: 5, to_user_id: 1, status_id: 3},
      { schedule_id: 4, user_id: 5, to_user_id: 1, status_id: 3},
    ]
    
    // レビューデータ
    this.review_data = [
      // case2
      { matching_id: 2, review_from: 1, review_to: 5, review_type: 1, review_comment: "とても気持ちよく撮影ができました。" },
      // case3
      { matching_id: 3, review_from: 5, review_to: 1, review_type: 1, review_comment: "写真もすぐに届きとても感謝しています。" },
      // case4
      { matching_id: 4, review_from: 1, review_to: 5, review_type: 1, review_comment: "機材運搬など手伝って頂きとても親切な方でした。" },
      { matching_id: 4, review_from: 5, review_to: 1, review_type: 2, review_comment: "撮影は問題ありませんでしたが、遅刻してこられたので気をつけてほしいです。" },
    ]

  }
  
  /**
   * データを生成します。
   * 
   */
  genReviewData(){
    return new Promise((resolve, reject) => {
      // ユーザーの生成
      this.genUserAndTags()
      .then(res => {
        console.log("  -> review data generating...")
        // スケジュールデータ作成
        return db.Schedule.bulkCreate(this.review_schedule_data)
      })
      .then(res => {
        // マッチングデータ作成
        return db.Matching.bulkCreate(this.review_matching_data)
      })
      .then(res => {
        // レビューデータ作成
        return db.Review.bulkCreate(this.review_data)
      })
      .then(res => {
        console.log("  -> complate!!");
        resolve(true);
      })
      .catch(err => {
        reject(err);
      })
    })
  }
}

module.exports = reviewPattern;