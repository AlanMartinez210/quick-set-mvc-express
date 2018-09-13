var chai = require('chai');
var should = chai.should();
var tagRepository = require("../../repository/tagRepository");
const sequelize = require('../../models/index').sequelize;

describe('tag repository test', function() {

  describe('upsertTagのテスト', function() {
    //最初にtagsテーブルを空にする
    before(async() =>{
        sequelize.query(`truncate table tags;`,{});
    });

    it('初回upsert時に戻り値が1になること', () =>  {
      return tagRepository().upsertTag('aaa', {})
      .then(res => {
        res.should.deep.equal({tag_id: 1});
      })
    });

    it('insertした値の確認', () =>  {
      return tagRepository().findAll({attributes:['id','tag_name','use_count']})
      .then(res => {
        res.should.deep.equal([{id: 1,tag_name:'aaa',use_count:1}]);
      })
    });

    it('重複upsert時に戻り値が1になること', () =>  {
      return tagRepository().upsertTag('aaa', {})
      .then(res => {
        res.should.deep.equal({tag_id: 1});
      })
    });

    it('updateした値の確認', () =>  {
      return tagRepository().findAll({attributes:['id','tag_name','use_count']})
      .then(res => {
        res.should.deep.equal([{id: 1,tag_name:'aaa',use_count:2}]);
      })
    });

    it('新しいタグ登録時にインクリメントされること', () =>  {
      return tagRepository().upsertTag('あああ', {})
      .then(res => {
        res.should.deep.equal({tag_id: 3});
      })
    });

    it('insertした値の確認', () =>  {
      return tagRepository().findAll({attributes:['id','tag_name','use_count']})
      .then(res => {
        res.should.deep.equal(
          [{id: 1,tag_name:'aaa',use_count:2},
           {id: 3,tag_name:'あああ',use_count:1}]
           //↑idが飛んでいるがbigintは膨大なので問題無し
          );
      })
    });
    it('タグ空白時の確認', () =>  {
      return tagRepository().upsertTag('', {})
      .then(res => {
        res.should.deep.equal({tag_id: 4});
      })
    });
    it('insertした値の確認', () =>  {
      return tagRepository().findAll({attributes:['id','tag_name','use_count']})
      .then(res => {
        res.should.deep.equal(
          [{id: 1,tag_name:'aaa',use_count:2},
           {id: 3,tag_name:'あああ',use_count:1},
           {id: 4,tag_name:'',use_count:1}]
          );
      })
    });
    it('タグ50文字の確認', () =>  {
      return tagRepository().upsertTag('アイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオ', {})
      .then(res => {
        res.should.deep.equal({tag_id: 5});
      })
    });
    it('insertした値の確認', () =>  {
      return tagRepository().findAll({attributes:['id','tag_name','use_count']})
      .then(res => {
        res.should.deep.equal(
          [{id: 1,tag_name:'aaa',use_count:2},
           {id: 3,tag_name:'あああ',use_count:1},
           {id: 4,tag_name:'',use_count:1},
           {id: 5,tag_name:'アイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオ',use_count:1}]
          );
      })
    });
  });
  describe('getTagRowByNameのテスト', function() {
  });

  describe('getTagRowByIdのテスト', function() {
  });
});