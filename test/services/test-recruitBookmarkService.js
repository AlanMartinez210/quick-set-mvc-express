const chai = require('chai'), should = chai.should(), assert = chai.assert, expect = chai.expect;
const sinon = require('sinon');
const recruitBookmarkRepository = require('../../repository/recruitBookmarkRepository')();

const recruitBookmarkService = require('../../services/recruitBookmarkService');


describe('recruitBookmarkService test', ()=>{
  describe('test:process', async()=>{
    it('ブックマーク登録', async ()=>{
      const user_id = 1, schedule_id = 2, mode = 1;
      
      const stub = sinon.stub(recruitBookmarkRepository, "createBookmark");
      stub.withArgs(user_id, schedule_id).returns('ADD OK');
      
      const results = await recruitBookmarkService.process(user_id, schedule_id, mode);
      
      expect(results).to.equal('ADD OK');
      stub.restore();
    });
    it('ブックマーク削除', async ()=>{
      const user_id = 1, schedule_id = 2, mode = 2;
      
      const stub = sinon.stub(recruitBookmarkRepository, "deleteBookmark");
      stub.withArgs(user_id, schedule_id).returns('DELETE OK');
      
      const results = await recruitBookmarkService.process(user_id, schedule_id, mode);
      
      expect(results).to.equal('DELETE OK');
      stub.restore();
    });
  });
});
