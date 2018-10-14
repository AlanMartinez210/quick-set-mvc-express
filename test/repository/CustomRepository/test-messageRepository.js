const chai = require('chai'), should = chai.should(), assert = chai.assert, expect = chai.expect;
const messageRepository = require("../../../repository/CustomRepository/messageRepository");

const {sequelize, Chat} = require('../../../models');

const matchingPattern = require("../../../testdata/pattern/matchingPattern");


describe('custom messageRepository test', ()=>{
  // データを初期化する
  before(async () => {
    const mp = new matchingPattern();
  	await mp.genMatchingData();
  });

  describe('getNewMessageList', ()=>{
    it('新着メッセージが検索できること', async ()=>{
      const message = await messageRepository.getNewMessageList(1);
      assert(message.length == 1, '不要なデータを取得しました');
      assert(message[0].id == 2, 'マッチングID:2以外のデータを取得しました');
    });
    it('既読メッセージを取得しないこと', async ()=>{
      let message = await messageRepository.getNewMessageList(4);
      assert(message.length == 0, "既読メッセージを取得しました" + JSON.stringify(message));
      message = await messageRepository.getNewMessageList(5);
      assert(message.length == 0, "既読メッセージを取得しました" + JSON.stringify(message));
      message = await messageRepository.getNewMessageList(6);
      assert(message.length == 0, "既読メッセージを取得しました" + JSON.stringify(message));
    });
  });

});
