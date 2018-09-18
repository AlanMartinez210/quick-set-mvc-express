const chai = require('chai'), should = chai.should(), assert = chai.assert;
const sinon = require('sinon');
const messageService = require('../../services/messageService');
const {req, res, next} = require('../expressModule/controllerHelper').getControllerArguments();
const {sequelize, User, Schedule, Matching} = require('../../models');

const messageRepository = require('../../repository/customRepository/messageRepository');




describe('MessageService test', ()=>{

  describe('test:getNewMessageList', async()=>{
    it('return messageRepository.getNewMessageList(user_id) になっていること', async ()=>{
      const user_id = 100;
      const return_obj = {success:"success"};
      messageRepository.getNewMessageList = (args1)=>{
        assert.deepEqual(args1, user_id, `渡している引数が違うよ`);
        return return_obj;
      };
      const result = await messageService.getNewMessageList(user_id);
      assert.deepEqual(result, return_obj, `結果が違うよ`);

    });
  });
});
