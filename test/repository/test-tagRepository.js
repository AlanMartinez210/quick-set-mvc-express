var chai = require('chai');
var should = chai.should();
var tagRepository = require("../../repository/tagRepository");
const sequelize = require('../../models/index').sequelize;

describe('tag repository test', function() {

  describe('upsertTagのテスト', function() {
    //最初にtagsテーブルを空にする
    before(async() =>{
      await sequelize.query(`truncate table tags;`,{});
    });

    it('初回upsert時の登録確認', async() => {
      // 登録し、戻り値の確認
      let upsertTagResult = await tagRepository().upsertTag('aaa', {});
      await chai.assert.deepEqual(upsertTagResult, {tag_id: 1});
      // insertした値の確認
      let insertedData = await tagRepository().findAll({attributes:['id','tag_name','use_count']});
      await chai.assert.deepEqual(insertedData, [{id: 1,tag_name:'aaa',use_count:1}]);
    });

    it('重複upsert時の確認', async() =>  {
      // 登録し、戻り値の確認
      let upsertTagResult = await tagRepository().upsertTag('aaa', {});
      await chai.assert.deepEqual(upsertTagResult, {tag_id: 1});
      // updateした値の確認
      let updatedData = await tagRepository().findAll({attributes:['id','tag_name','use_count']});
      await chai.assert.deepEqual(updatedData, [{id: 1,tag_name:'aaa',use_count:2}]);
    });

    it('新規タグ登録時の確認', async() => {
      // 登録し、戻り値の確認
      let upsertTagResult = await tagRepository().upsertTag('あああ', {});
      await chai.assert.deepEqual(upsertTagResult, {tag_id: 3}); // idが飛んでいるがbigintは膨大なので問題無し
      // insertした値の確認
      let insertedData = await tagRepository().findAll({attributes:['id','tag_name','use_count']});
      await chai.assert.deepEqual(insertedData, [
        {id: 1,tag_name:'aaa',use_count:2},
        {id: 3,tag_name:'あああ',use_count:1} // idが飛んでいるがbigintは膨大なので問題無し
      ]);
    });

    it('タグ255文字の確認', async() =>  {
      // 登録し、戻り値の確認
      let upsertTagResult = await tagRepository().upsertTag('アイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエＺ', {});
      await chai.assert.deepEqual(upsertTagResult, {tag_id: 4});
      // insertした値の確認
      let insertedData = await tagRepository().findAll({attributes:['id','tag_name','use_count']});
      await chai.assert.deepEqual(insertedData, [
        {id: 1, tag_name:'aaa',use_count:2},
        {id: 3, tag_name:'あああ',use_count:1},
        {id: 4, tag_name:'アイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエオアイウエＺ',use_count:1}
      ]);
    });
  });

  describe('getTagIdByNameのテスト', function() {
    //最初にtagsテーブルを空にする
    before(async() =>{
      sequelize.query(`truncate table tags;`,{});
      await tagRepository().upsertTag('aaa');
      await tagRepository().upsertTag('bbb');
      await tagRepository().upsertTag('ccc');
    });

    it('タグを0件取得するテスト(検索指定無し)', async() =>  {
      let tagRows = await tagRepository().getTagByName([], {});
      await chai.assert.deepEqual(tagRows, []);
    });

    it('タグを0件取得するテスト(検索結果0件)', async() =>  {
      let tagRows = await tagRepository().getTagByName(['ddd'], {});
      await chai.assert.deepEqual(tagRows, []);
    });

    it('タグを1件取得するテスト', async() =>  {
      let tagRows = await tagRepository().getTagByName(['aaa'], {});
      await chai.assert.deepEqual(tagRows, [
        {'id': 1, 'tag_name': 'aaa', 'use_count': 1}
      ]);
    });

    it('タグを2件取得するテスト(2件指定)', async() =>  {
      let tagRows = await tagRepository().getTagByName(['aaa','bbb'], {});
      await chai.assert.deepEqual(tagRows, [
        {'id': 1, 'tag_name': 'aaa', 'use_count': 1},
        {'id': 2, 'tag_name': 'bbb', 'use_count': 1}
      ]);
    });

    it('タグを2件取得するテスト(3件指定)', async() =>  {
      let tagRows = await tagRepository().getTagByName(['bbb','ccc','ddd'], {});
      await chai.assert.deepEqual(tagRows, [
        {'id': 2, 'tag_name': 'bbb', 'use_count': 1},
        {'id': 3, 'tag_name': 'ccc', 'use_count': 1}
      ]);
    });
  });

  describe('getTagByIdのテスト', function() {
    //最初にtagsテーブルを空にする
    before(async() =>{
      sequelize.query(`truncate table tags;`,{});
      await tagRepository().upsertTag('aaa');
      await tagRepository().upsertTag('bbb');
      await tagRepository().upsertTag('ccc');
    });

    it('タグを0件取得するテスト(検索指定無し)', async() =>  {
      let tagRows = await tagRepository().getTagById([], {});
      await chai.assert.deepEqual(tagRows, []);
    });

    it('タグを0件取得するテスト(検索結果0件)', async() =>  {
      let tagRows = await tagRepository().getTagById(['ddd'], {});
      await chai.assert.deepEqual(tagRows, []);
    });

    it('タグを1件取得するテスト', async() =>  {
      let tagRows = await tagRepository().getTagById([1], {});
      await chai.assert.deepEqual(tagRows, [
        {'id': 1, 'tag_name': 'aaa', 'use_count': 1}
      ]);
    });

    it('タグを2件取得するテスト(2件指定)', async() =>  {
      let tagRows = await tagRepository().getTagById([1, 2], {});
      await chai.assert.deepEqual(tagRows, [
        {'id': 1, 'tag_name': 'aaa', 'use_count': 1},
        {'id': 2, 'tag_name': 'bbb', 'use_count': 1}
      ]);
    });

    it('タグを2件取得するテスト(3件指定)', async() =>  {
      let tagRows = await tagRepository().getTagById([2, 3, 4], {});
      await chai.assert.deepEqual(tagRows, [
        {'id': 2, 'tag_name': 'bbb', 'use_count': 1},
        {'id': 3, 'tag_name': 'ccc', 'use_count': 1}
      ]);
    });
  });
});