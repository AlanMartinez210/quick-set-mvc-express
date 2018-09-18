const schedule = require('../../../models/schedule');
const user = require('../../../models/user');
const tag = require('../../../models/tag');
const schedule_tag = require('../../../models/schedule_tag');
const schedule_prefecture = require('../../../models/schedule_prefecture');
const hashHelper = require('../../../common/helper/hashHelper');
const dateHelper = require('../../../common/helper/dateHelper');

// 基本的なテストを行うためのテストデータを作成します。

module.exports = class {
  constructor(){
    // カメラマンデータ
    this.cam_user_data = [];
    for(var i=1;i<=10;i++){
      const user_data = {}
      user_data.user_name = "test_camera_man_" + i;
      const password = "pass" + i;
      user_data.password = hashHelper(password);
      user_data.email = "test.cam_" + i + "_cs@c2link.mail.com";
      user_data.icon_url = "http://s3.c2link.test/test" + i + ".jpg"
      user_data.user_type = 2;
      user_data.tags = [i%8+1, (i+1)%8+1, (i+2)%8+1];
      user_data.prefectures = [13+i, 14+i];
      console.log(user_data);
      this.cam_user_data.push(user_data)
    }
    // コスプレイヤーデータ
    this.cos_user_data = [];
    for(var i=1;i<=10;i++){
      const user_data = {}
      user_data.user_name = "test_cosplayer_" + i;
      const password = "pass" + i;
      user_data.password = hashHelper(password);
      user_data.email = "test.cos_" + i + "_cs@c2link.mail.com";
      user_data.icon_url = "http://s3.c2link.test/test" + i + ".jpg"
      user_data.user_type = 1;
      user_data.tags = [i%8+1, (i+1)%8+1, (i+2)%8+1];
      user_data.prefectures = [13+i, 14+i];
      console.log(user_data);
      this.cos_user_data.push(user_data)
    }

    this.schedule_data = [];
    for(var i=1;i<=3;i++){
      for(var j=1;j<=10;j++){
        var initdatacam = {
          user_id: 1,
          schedule_type: 2,
          time_from: (6 + j) + ":00",
          time_to: (12 + j) + ":00",
          event_url: "htt://c2link.com/detail/event/test",
          shot_type: 1,
          cost: 1000,
          num: 1,
          remarks: "カメラマンテストスケジュール"
        }
        var initdatacos = {
          user_id: 2,
          schedule_type: 1,
          time_from: (6 + j) + ":00",
          time_to: (12 + j) + ":00",
          event_url: "htt://c2link.com/detail/event/test",
          shot_type: 1,
          cost: 1000,
          num: 1,
          remarks: "テストコスプレイヤスケジュール"
        }
        initdatacam.date_key = dateHelper.createDate(2018, (7 + i), j).toDate();
        initdatacam.event_name = "テストイベント" + i;
        initdatacos.date_key = dateHelper.createDate(2018, (7 + i), j).toDate();
        initdatacos.event_name = "テストイベント" + i;
        this.schedule_data.push(initdatacam);
        this.schedule_data.push(initdatacos);
      }
    }

    this.tag_data = [
      {tag_name: "カメラOK"},
      {tag_name: "会員のみ"},
      {tag_name: "データ一週間渡し"},
      {tag_name: "カメラ必須"},
      {tag_name: "夜間撮影あり"},
      {tag_name: "衣装複数あり"},
      {tag_name: "写真掲載あり"},
      {tag_name: "女性カメラマン限定"},
      {tag_name: "ストロボ"},
    ]

    // スケジュールのタグ
    this.schedule_tags = [
    ]



    // スケジュールの都道府県
    this.schedule_prefectures = []
    for(var i=1;i<60;i++){

    }




    console.log(this.schedule_data);
      
  }
  


  genTestData(){
    console.log("======= userDataを作成します。=========");
    // カメラマンデータの作成
    const cam_user_data = []
  }
}