const chai = require('chai'), should = chai.should(), assert = chai.assert, expect = chai.expect;
const sinon = require('sinon');
const matchingRepository = require('../../repository/matchingRepository')();
const customMatchingRepository = require('../../repository/CustomRepository/matchingRepository');
const errorHelper = require('../../common/helper/errorHelper');

const matchingService = require('../../services/matchingService');


describe('MatchingService test', ()=>{
  describe('test:getMatchingList', async()=>{
    it('正常データ', async ()=>{
      const stub = sinon.stub(customMatchingRepository, "getMatchingList");
      stub.withArgs({user_id: 1}).returns(Promise.resolve([{
        from_user_id: 1,
        to_user_icon_url: 'to_user_icon_url',
        to_user_user_name: 'to_user_user_name',
        status_id: 'status_id',
        created_at: 'created_at',
      },{
        from_user_id: 2,
        from_user_icon_url: 'from_user_icon_url',
        from_user_user_name: 'from_user_user_name',
        status_id: 'status_id',
        created_at: 'created_at',
      }]));
      const results = (await matchingService.getMatchingList(1)).map(row=>{
        return {
          icon_url: row.icon_url,
          user_name: row.user_name,
          status_type: row.status_type,
          datetime_info: row.datetime_info,
        };
      });
      expect(results).to.deep.equal([{
        user_name: "to_user_user_name",
        icon_url: "to_user_icon_url",
        status_type: "status_id",
        datetime_info: "created_at",
      },{
        user_name: "from_user_user_name",
        icon_url: "from_user_icon_url",
        status_type: "status_id",
        datetime_info: "created_at",
      }]);
      stub.restore();
    });
  });
  
  
  describe('test:getMatchingHistoryList', async()=>{
    it('正常データ', async ()=>{
      const stub = sinon.stub(customMatchingRepository, "getMatchingHistoryList");
      stub.withArgs({user_id: 1}).returns(Promise.resolve([{
        from_user_id: 1,
        to_user_icon_url: 'to_user_icon_url',
        to_user_user_name: 'to_user_user_name',
        status_id: 'status_id',
        created_at: 'created_at',
      },{
        from_user_id: 2,
        from_user_icon_url: 'from_user_icon_url',
        from_user_user_name: 'from_user_user_name',
        status_id: 'status_id',
        created_at: 'created_at',
      }]));
      const results = (await matchingService.getMatchingHistoryList(1)).map(row=>{
        return {
          icon_url: row.icon_url,
          user_name: row.user_name,
          status_type: row.status_type,
          datetime_info: row.datetime_info,
        };
      });
      expect(results).to.deep.equal([{
        user_name: "to_user_user_name",
        icon_url: "to_user_icon_url",
        status_type: "status_id",
        datetime_info: "created_at",
      },{
        user_name: "from_user_user_name",
        icon_url: "from_user_icon_url",
        status_type: "status_id",
        datetime_info: "created_at",
      }]);
      stub.restore();
    });
  });


  describe('test:postRequest', async()=>{
    it('正常データ', async ()=>{
      const stub = sinon.stub(matchingRepository, "create");
      stub.withArgs({
        schedule_id: 1,
        user_id: 2,
        status_id: 1,
      }).returns(Promise.resolve(true));
      const results = (await matchingService.postRequest(2, 1));
      expect(results).to.deep.equal(true);
      stub.restore();
    });

    it('同じ依頼に応募したときにL00002エラーになること', async ()=>{
      const stub = sinon.stub(matchingRepository, "create");
      stub.withArgs({
        schedule_id: 1,
        user_id: 2,
        status_id: 1,
        }).returns(Promise.reject({errors: [{path: 'matchings_user_id_schedule_id'}]}));
      try{
        await matchingService.postRequest(2, 1);
      }catch(err){
        expect(err).to.deep.equal(new errorHelper().setWindowMsg('L00002'));
      }
      stub.restore();
    });
  });

  describe('test:postConsent', async()=>{
    it('正常データ', async ()=>{
      const stub = sinon.stub(matchingRepository, "create");
      stub.withArgs({
        schedule_id: 1,
        user_id: 2,
        status_id: 1,
      }).returns(Promise.resolve(true));
      const results = (await matchingService.postRequest(2, 1));
      expect(results).to.deep.equal(true);
      stub.restore();
    });

    it('同じ依頼に応募したときにL00002エラーになること', async ()=>{
      const stub = sinon.stub(matchingRepository, "create");
      stub.withArgs({
        schedule_id: 1,
        user_id: 2,
        status_id: 1,
        }).returns(Promise.reject({errors: [{path: 'matchings_user_id_schedule_id'}]}));
      try{
        await matchingService.postRequest(2, 1);
      }catch(err){
        expect(err).to.deep.equal(new errorHelper().setWindowMsg('L00002'));
      }
      stub.restore();
    });
  });

  describe('test:postReject', async()=>{
    it('正常データ', async ()=>{
      const user_id = 2, matching_id = 1;
      const stub = {
        findOne :sinon.stub(matchingRepository, "findOne"),
        update  :sinon.stub(matchingRepository, "update"),
      };
      stub.findOne.withArgs({
        where:{
          to_user_id: user_id,
          status_id: 1,
          id: matching_id,
        }
      }).returns(Promise.resolve({id: matching_id}));
      
      stub.update.withArgs({
        status_id: 5,
      },{
        where:{
          id: matching_id,
        }
      }).returns(Promise.resolve({id: matching_id}));
      
      const results = (await matchingService.postReject(user_id, matching_id));
      expect(results).to.deep.equal(true);
      stub.findOne.restore();
      stub.update.restore();
    });

    it('存在しない依頼を却下した場合にL00005エラーになること', async ()=>{
      const user_id = 2, matching_id = 1;
      const stub = {
        findOne :sinon.stub(matchingRepository, "findOne"),
      };
      stub.findOne.withArgs({
        where:{
          to_user_id: user_id,
          status_id: 1,
          id: matching_id,
        }
      }).returns(Promise.resolve(null));
      
      try{
        const results = (await matchingService.postReject(user_id, matching_id));
      }catch(err){
        expect(err).to.deep.equal(new errorHelper().setWindowMsg('L00005'));
      }
      
      stub.findOne.restore();
    });
  
  });
  
  
});
