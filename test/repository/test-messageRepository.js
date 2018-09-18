const chai = require('chai'), should = chai.should(), assert = chai.assert;
var messageRepository = require("../../repository/messageRepository");

const {sequelize, Chat} = require('../../models');

describe('messageRepository test', ()=>{
  //最初にchatsテーブルを空にする
  before(async() =>{
    sequelize.query(`truncate table chats;`,{});
  });
  describe('postMessage', ()=>{
    const testData = {matching_id: 1, user_id: 1, message: "テスト文字文字"};
    it('チャットに発言ができること', async ()=>{
      await messageRepository.postMessage(testData.matching_id, testData.user_id, testData.message);
      const message = await Chat.findAll({where:testData, raw:true, attributes:Object.keys(testData)});
      assert.deepEqual(message, [testData]);
    });
    it('同じチャットに2回発言ができること', async ()=>{
      await messageRepository.postMessage(testData.matching_id, testData.user_id, testData.message);
      const message = await Chat.findAll({where:testData, raw:true, attributes:Object.keys(testData)});
      assert.deepEqual(message, [testData, testData]);
    });

  });

});
