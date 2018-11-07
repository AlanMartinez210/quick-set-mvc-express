const chai = require('chai'), should = chai.should(), assert = chai.assert, expect = chai.expect;
const matchingRepository = require("../../../repository/CustomRepository/matchingRepository");

const matchingPattern = require("../../../testdata/pattern/matchingPattern");
const globalVariables = require("../../../common/middleware/globalVariables")({},{},()=>{});

const moment = require('moment');

describe('custom matchingRepository test', ()=>{
  // データを初期化する
  before(async ()=>{
    const mp = new matchingPattern();
  	await mp.genMatchingData();
  });

  describe('getMatchingList', ()=>{
    it('マッチング一覧の取得', async ()=>{
      let matching_list = await matchingRepository.getMatchingList({user_id:1, date_key: moment(new Date("2018-08-01"))});
      matching_list = matching_list.map(v=>{
        return {
          matching_id: v.matching_id,
          from_user_id: v.from_user_id,
          to_user_id: v.to_user_id,
          status_id: v.status_id,
        };
      });

      expect(matching_list).to.deep.equal(
        [
//          {matching_id:15,from_user_id:6,to_user_id:1,status_id:5},
          {matching_id:14,from_user_id:5,to_user_id:1,status_id:3},
          {matching_id:13,from_user_id:6,to_user_id:1,status_id:1},
          {matching_id:12,from_user_id:5,to_user_id:1,status_id:1},
//          {matching_id:11,from_user_id:5,to_user_id:1,status_id:5},
          {matching_id:10,from_user_id:5,to_user_id:1,status_id:3},
          {matching_id: 9,from_user_id:5,to_user_id:1,status_id:1},
//          {matching_id: 8,from_user_id:6,to_user_id:1,status_id:5},
          {matching_id: 7,from_user_id:5,to_user_id:1,status_id:3},
          {matching_id: 6,from_user_id:6,to_user_id:1,status_id:1},
          {matching_id: 5,from_user_id:5,to_user_id:1,status_id:1},
//          {matching_id: 4,from_user_id:5,to_user_id:1,status_id:5},
          {matching_id: 3,from_user_id:5,to_user_id:1,status_id:3},
          {matching_id: 2,from_user_id:5,to_user_id:1,status_id:1},
          {matching_id: 1,from_user_id:5,to_user_id:1,status_id:1},
        ]
      );
    });
  });

  describe('getMatchingHistoryList', ()=>{
    it('マッチング履歴一覧の取得', async ()=>{
      let matching_list = await matchingRepository.getMatchingHistoryList({user_id:1, date_key: moment(new Date())});
      matching_list = matching_list.map(v=>{
        return {
          matching_id: v.matching_id,
          from_user_id: v.from_user_id,
          to_user_id: v.to_user_id,
          status_id: v.status_id,
        };
      });

      expect(matching_list).to.deep.equal(
        [
          {matching_id:15,from_user_id:6,to_user_id:1,status_id:5},
          {matching_id:14,from_user_id:5,to_user_id:1,status_id:3},
          {matching_id:13,from_user_id:6,to_user_id:1,status_id:1},
          {matching_id:12,from_user_id:5,to_user_id:1,status_id:1},
          {matching_id:11,from_user_id:5,to_user_id:1,status_id:5},
          {matching_id:10,from_user_id:5,to_user_id:1,status_id:3},
          {matching_id: 9,from_user_id:5,to_user_id:1,status_id:1},
          {matching_id: 8,from_user_id:6,to_user_id:1,status_id:5},
          {matching_id: 7,from_user_id:5,to_user_id:1,status_id:3},
          {matching_id: 6,from_user_id:6,to_user_id:1,status_id:1},
          {matching_id: 5,from_user_id:5,to_user_id:1,status_id:1},
          {matching_id: 4,from_user_id:5,to_user_id:1,status_id:5},
          {matching_id: 3,from_user_id:5,to_user_id:1,status_id:3},
          {matching_id: 2,from_user_id:5,to_user_id:1,status_id:1},
          {matching_id: 1,from_user_id:5,to_user_id:1,status_id:1},
        ]
      );
    });
  });

});
