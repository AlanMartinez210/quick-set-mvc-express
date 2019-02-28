const db = require("../../../models/index");

const hashHelper = require('../../../common/helper/hashHelper');
const dateHelper = require('../../../common/helper/dateHelper');

// 基本的なテストを行うためのテストデータを作成します。

module.exports = class {
  constructor(){
    // カメラマンデータ
    this.cam_user_data = [];
    for(let i=1;i<=3;i++){
      const user_data = {}
      user_data.icon_url = "default.png";
      user_data.bg_image_url = "default_bg.png";
      user_data.user_name = "test_camera_man_" + i;
      const password = "password" + i;
      user_data.password = hashHelper(password);
      user_data.email = "test.cam_" + i + "_cs@c2link.mail.com";
      user_data.user_type = 2;
      user_data.tags = [i%8+1, (i+1)%8+1, (i+2)%8+1];
      user_data.prefectures = [13+i, 14+i];
      this.cam_user_data.push(user_data)
    }
    // コスプレイヤーデータ
    this.cos_user_data = [];
    for(let i=1;i<=3;i++){
      const user_data = {}
      user_data.icon_url = "default.png";
      user_data.bg_image_url = "default_bg.png";
      user_data.user_name = "test_cosplayer_" + i;
      const password = "password" + i;
      user_data.password = hashHelper(password);
      user_data.email = "test.cos_" + i + "_cs@c2link.mail.com";
      user_data.user_type = 1;
      user_data.tags = [i%8+1, (i+1)%8+1, (i+2)%8+1];
      user_data.prefectures = [13+i];
      this.cos_user_data.push(user_data)
    }

    // 3ヶ月前を取得
    // スケジュールデータ
    this.schedule_data = [];
    
    // cam
    for(let i=1;i<=3;i++){ // 3人分 

      const month = []
      month[1] = dateHelper.getDate().subtract(1, 'M');
      month[2] = dateHelper.getDate();
      month[3] = dateHelper.getDate().add(1, 'M');

      for(let l=1;l<=3;l++){ // 3ヶ月分        
        for(let j=1;j<=10;j++){ // 10日分のスケジュール
          this.schedule_data.push({
            date_key: month[l].add(1, 'd').clone(),
            user_id: i,
            schedule_type: 2,
            time_from: (6 + j) + ":00",
            time_to: (12 + j) + ":00",
            event_url: "htt://c2link.com/detail/event/test",
            shot_type: 1,
            cost: 1000,
            num: 1,
            event_name: "テストカメイベント",
            remarks: "カメラマンテストスケジュール"
          });
        }
      }
    }


    // cos
    for(let i=1;i<=3;i++){  // 3人分

      const month = []
      month[1] = dateHelper.getDate().subtract(1, 'M');
      month[2] = dateHelper.getDate();
      month[3] = dateHelper.getDate().add(1, 'M');

      for(let l=1;l<=3;l++){ // 3ヶ月分
        for(let j=1;j<=10;j++){ // 10日分のスケジュール
          this.schedule_data.push({
            date_key: month[l].add(1, 'd').clone(),
            user_id: i+3,
            schedule_type: 1,
            time_from: (6 + j) + ":00",
            time_to: (12 + j) + ":00",
            event_url: "htt://c2link.com/detail/event/test",
            shot_type: 1,
            cost: 1000,
            num: 1,
            event_name: "テストコスイベント",
            remarks: "コスプレイヤーテストスケジュール"
          });

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
        if(i <= 90){
          tags.schedule_id = i;
          tags.tag_id = j;
        }else{
          tags.schedule_id = i;
          tags.tag_id = j+3;
        }
        this.schedule_tags.push(tags);
      }
    }

    // スケジュールの都道府県
    this.schedule_prefectures = []
    for(var i=1;i<=180;i++){
      for(var j=1;j<=2;j++){
        const prefectures = {};
        if(i <= 90){
          prefectures.schedule_id = i;
          prefectures.prefecture_id = j%2+14;
        }else{
          prefectures.schedule_id = i;
          prefectures.prefecture_id = j%2+23;
        }
        this.schedule_prefectures.push(prefectures);
      }
    }

    // お知らせ
    this.notice_data = []
    for(var i=1;i<=10;i++){
      const notice = {};
      notice.notice_date = dateHelper.createDate(2018, 11, i);
      notice.type = (i%3)+1;
      notice.title = "新しいお知らせ" + i;
      notice.content = "お知らせ本部<br /><br />これは新しいおしらせです。<br />これは新しいおしらせです。<br />これは新しいおしらせです。";
      notice.islogin = i%2;
      this.notice_data.push(notice);
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
        return db.User.bulkCreate(this.cam_user_data);
      })
      .then(res => {
        return db.User.bulkCreate(this.cos_user_data);
      })
      .then(res =>{
        Promise.all([
          db.Schedule.bulkCreate(this.schedule_data),
          db.Tag.bulkCreate(this.tag_data),
          db.Schedule_tag.bulkCreate(this.schedule_tags),
          db.Schedule_prefecture.bulkCreate(this.schedule_prefectures),
          db.Notice.bulkCreate(this.notice_data)
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
        return db.User.bulkCreate(this.cam_user_data);
      })
      .then(res => {
        return db.User.bulkCreate(this.cos_user_data);
      })
      .then(res =>{
        Promise.all([
          db.Tag.bulkCreate(this.tag_data),
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
          return v;
        })
        return db.User.bulkCreate(user_data);
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
    return db.User.findById(user_id, {raw: true})
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
        db.sequelize.query(`truncate table users;`,{}),
        db.sequelize.query(`truncate table schedules;`,{}),
        db.sequelize.query(`truncate table schedule_tags;`,{}),
        db.sequelize.query(`truncate table schedule_prefectures;`,{}),
        db.sequelize.query(`truncate table tags;`,{}),
        db.sequelize.query(`truncate table reviews;`,{}),
        db.sequelize.query(`truncate table matchings;`,{}),
        db.sequelize.query(`truncate table chats;`,{}),
        db.sequelize.query(`truncate table authtwitters;`,{}),
        db.sequelize.query(`truncate table notices;`,{}),
        db.sequelize.query(`truncate table content_charas;`,{}),
        db.sequelize.query(`truncate table content_titles;`,{}),
        db.sequelize.query(`truncate table equipment;`,{}),
        db.sequelize.query(`truncate table recruit_bookmarks;`,{}),
        db.sequelize.query(`truncate table user_content_relations;`,{})
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