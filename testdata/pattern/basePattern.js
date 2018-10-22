const abstractRepository = require("../../repository/abstractRepository");

const schedule = abstractRepository("Schedule");
const user = abstractRepository("User");
const tag = abstractRepository("Tag");
const schedule_tag = abstractRepository("Schedule_tag");
const schedule_prefecture = abstractRepository("Schedule_prefecture");

const hashHelper = require('../../common/helper/hashHelper');
const dateHelper = require('../../common/helper/dateHelper');

// 基本的なテストを行うためのテストデータを作成します。

module.exports = class {
  constructor(){
    // カメラマンデータ
    this.cam_user_data = [];
    for(var i=1;i<=3;i++){
      const user_data = {}
      user_data.user_name = "test_camera_man_" + i;
      const password = "password" + i;
      user_data.password = hashHelper(password);
      user_data.email = "test.cam_" + i + "_cs@c2link.mail.com";
      user_data.icon_url = "http://s3.c2link.test/test" + i + ".jpg"
      user_data.user_type = 2;
      user_data.tags = [i%8+1, (i+1)%8+1, (i+2)%8+1];
      user_data.prefectures = [13+i, 14+i];
      this.cam_user_data.push(user_data)
    }
    // コスプレイヤーデータ
    this.cos_user_data = [];
    for(var i=1;i<=3;i++){
      const user_data = {}
      user_data.user_name = "test_cosplayer_" + i;
      const password = "password" + i;
      user_data.password = hashHelper(password);
      user_data.email = "test.cos_" + i + "_cs@c2link.mail.com";
      user_data.icon_url = "http://s3.c2link.test/test" + i + ".jpg"
      user_data.user_type = 1;
      user_data.tags = [i%8+1, (i+1)%8+1, (i+2)%8+1];
      user_data.prefectures = [13+i];
      this.cos_user_data.push(user_data)
    }

    // スケジュールデータ
    this.schedule_data = [];
    for(var i=1;i<=3;i++){ // 3ヶ月分
      for(var l=1;l<=6;l++){ // 6人分
        for(var j=1;j<=10;j++){ // 10日分のスケジュール
          var schedule = {};
          if(l <= 3){
            // 種別cam
            schedule = {
              user_id: l,
              schedule_type: 2,
              time_from: (6 + j) + ":00",
              time_to: (12 + j) + ":00",
              event_url: "htt://c2link.com/detail/event/test",
              shot_type: 1,
              cost: 1000,
              num: 1,
              remarks: "カメラマンテストスケジュール"
            }
          }else{
            // 種別cos
            schedule = {
              user_id: l,
              schedule_type: 1,
              time_from: (6 + j) + ":00",
              time_to: (12 + j) + ":00",
              event_url: "htt://c2link.com/detail/event/test",
              shot_type: 1,
              cost: 1000,
              num: 1,
              remarks: "コスプレイヤーテストスケジュール"
            }
          }
          schedule.date_key = dateHelper.createDate(2018, (7 + i), j).toDate();
          schedule.event_name = "テストイベント" + i;
          this.schedule_data.push(schedule);
        }
      }
    }

    // タグデータ
    this.tag_data = [
      {tag_name: "カメラOK", use_count: 15},
      {tag_name: "会員のみ", use_count: 1},
      {tag_name: "データ一週間渡し", use_count: 12},
      {tag_name: "カメラ必須", use_count: 18},
      {tag_name: "夜間撮影あり", use_count: 15},
      {tag_name: "衣装複数あり", use_count: 13},
      {tag_name: "写真掲載あり", use_count: 8},
      {tag_name: "女性カメラマン限定", use_count: 3},
      {tag_name: "ストロボ", use_count: 2},
    ]

    // スケジュールのタグ
    this.schedule_tags = []
    for(var i=1;i<=180;i++){
      for(var j=1;j<=3;j++){
        const tags = {};
        tags.schedule_id = i;
        tags.tag_id = j;
        this.schedule_tags.push(tags);
      }
    }

    // スケジュールの都道府県
    this.schedule_prefectures = []
    for(var i=1;i<=180;i++){
      for(var j=1;j<=2;j++){
        const prefectures = {};
        prefectures.schedule_id = i;
        prefectures.prefecture_id = j%2+14;
        this.schedule_prefectures.push(prefectures);
      }
    }
  }
  /**
   * #### 基盤データの生成  
   * ##### 以下のデータを作成します。
   *   - user
   *   - tag
   *   - schedule
   *   - schedule_tag
   *   - schedule_prefecture  
   * 
   */
  genTestData(){
    return new Promise((resolve, reject) => {
      this.trancateAll()
      .then(res => {
        console.log("  -> test data generating...")
        return user.bulkCreate(this.cam_user_data);
      })
      .then(res => {
        return user.bulkCreate(this.cos_user_data);
      })
      .then(res =>{
        Promise.all([
          schedule.bulkCreate(this.schedule_data),
          tag.bulkCreate(this.tag_data),
          schedule_tag.bulkCreate(this.schedule_tags),
          schedule_prefecture.bulkCreate(this.schedule_prefectures)
        ])
        .then(res => {
          console.log("  -> complate!!");
          resolve(true);
        })
        .catch(err => {
          reject(err);
        }) 
      })
    });
  }
  /**
   * #### ユーザーデータの生成  
   * ##### 以下のデータを作成します。
   *   - user
   *   - tag
   * 
   */
  genUserAndTags(){
    return new Promise((resolve, reject) => {
      this.trancateAll()
      .then(res => {
        console.log("  -> user and tag data generating...")
        return user.bulkCreate(this.cam_user_data);
      })
      .then(res => {
        return user.bulkCreate(this.cos_user_data);
      })
      .then(res =>{
        Promise.all([
          tag.bulkCreate(this.tag_data),
        ])
        .then(res => {
          console.log("  -> complate!!");
          resolve(true);
        })
        .catch(err => {
          reject(err);
        }) 
      })
    });
  }
  /**
   * #### ユーザーデータの生成  
   * ##### 今日が退会期日のユーザーを生成します。
   *  - users
   * 
   */
  getUserExpirationDate(){
    return new Promise((resolve, reject) => {
      this.trancateAll()
      .then(res => {
        console.log("  -> user is expiration date to today data generating...");
        const user_data = this.cam_user_data.map(v => {
          v.expiration_date = new Date();
          console.log(v);
          return v;
        })
        return user.bulkCreate(user_data);
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
  /**
   * 指定したユーザーIDのユーザーデータを取得します。
   * 
   * @param {*} user_id 
   */
  getUserData(user_id){
    return user.findById(user_id, {raw: true})
    .then(res => {
      return res;
    })
  }
  /**
   * 指定したユーザーIDでログインした状態のリクエストを取得します。
   * 
   * @param {*} user_id 
   */
  getloginSesstionRequest(user_id){
    return this.getUserData(user_id)
    .then(res => {
      return {
        session: {
          cookie:
          { path: '/',
            _expires: '2019-07-19T08:52:48.854Z',
            originalMaxAge: 31536000000,
            httpOnly: true },
          user: {
            id: res.id,
            user_name: res.user_name,
            email: res.email,
            user_type: res.user_type
          }
        },
        params:{},
        body:{},
        query:{}
      }
    })
  }
  /**
   * すべてのテーブルのデータを削除します。
   * 
   */
  trancateAll(){
    console.log("  -> all table trancate...")
    return new Promise((resolve, reject) => {
      Promise.all([
        abstractRepository().Sequelize.query(`truncate table users;`,{}),
        abstractRepository().Sequelize.query(`truncate table schedules;`,{}),
        abstractRepository().Sequelize.query(`truncate table schedule_tags;`,{}),
        abstractRepository().Sequelize.query(`truncate table schedule_prefectures;`,{}),
        abstractRepository().Sequelize.query(`truncate table tags;`,{}),
        abstractRepository().Sequelize.query(`truncate table reviews;`,{}),
        abstractRepository().Sequelize.query(`truncate table matchings;`,{}),
        abstractRepository().Sequelize.query(`truncate table chats;`,{}),
        abstractRepository().Sequelize.query(`truncate table authtwitters;`,{}),
      ])
      .then(res => {
        console.log("  -> complate!!");
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
    });
  }
}