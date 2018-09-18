const chai = require('chai'), should = chai.should(), assert = chai.assert;
var messageRepository = require("../../../repository/CustomRepository/messageRepository");

const {sequelize, Chat} = require('../../../models');

describe('custom messageRepository test', ()=>{
  //最初にテーブルを空にする
  before(async() =>{
    await sequelize.query(`truncate table users;`,{});
    await sequelize.query(`truncate table chats;`,{});
    await sequelize.query(`truncate table schedules;`,{});
    await sequelize.query(`truncate table matchings;`,{});

    await sequelize.query(`
      insert into users (id, user_name, icon_url, user_type) values
      (1, 'user_name1', 'icon_url1', 1),
      (2, 'user_name2', 'icon_url2', 2);
    `,{})
    .catch(err=>{console.log('users error ')});

    await sequelize.query(`
      insert into schedules (id, user_id, schedule_type, date_key) values
      (1, 1, 1, now()),
      (2, 2, 2, now());
    `,{})
    .catch(err=>{console.log('schedules error ')});

    await sequelize.query(`
      insert into matchings (id, user_id, schedule_id) values
      (1, 2, 1),
      (2, 1, 2);
    `,{})
    .catch(err=>{console.log('matchings error ')});

    await sequelize.query(`
      insert into chats (matching_id, message) values
      (2, 'message1'),
      (1, 'message2');
    `,{})
    .catch(err=>{console.log('chats error ', err)});


  });
  describe('getNewMessageList', ()=>{
    const testData = {matching_id: 1, user_id: 1, message: "テスト文字文字"};
    it('新着メッセージが検索できること', async ()=>{
      const result = (await messageRepository.getNewMessageList(1)).map(obj=>{
        return {
          icon_url:obj.icon_url,
          id:obj.id,
          last_message:obj.last_message,
          schedule_id:obj.schedule_id,
          status_id:obj.status_id,
          to_user_id:obj.to_user_id,
          user_id:obj.user_id,
          user_name:obj.user_name
        }
      });
      assert.deepEqual(result, [{
          "icon_url": "icon_url2",
          "id": 1,
          "last_message": "message2",
          "schedule_id": 1,
          "status_id": null,
          "to_user_id": 1,
          "user_id": 2,
          "user_name": "user_name2"
        },
        {
          "icon_url": "icon_url2",
          "id": 2,
          "last_message": "message1",
          "schedule_id": 2,
          "status_id": null,
          "to_user_id": 2,
          "user_id": 1,
          "user_name": "user_name2",
        }
      ]);
    });
    it('既読メッセージを取得しないこと', async ()=>{
      await sequelize.query(`update chats set read_count = 1 where matching_id = 2;`);
      const result = (await messageRepository.getNewMessageList(1)).map(obj=>{
        return {
          icon_url:obj.icon_url,
          id:obj.id,
          last_message:obj.last_message,
          schedule_id:obj.schedule_id,
          status_id:obj.status_id,
          to_user_id:obj.to_user_id,
          user_id:obj.user_id,
          user_name:obj.user_name
        }
      });
      assert.deepEqual(result, [{
          "icon_url": "icon_url2",
          "id": 1,
          "last_message": "message2",
          "schedule_id": 1,
          "status_id": null,
          "to_user_id": 1,
          "user_id": 2,
          "user_name": "user_name2"
        }
      ]);
    });
  });

});
