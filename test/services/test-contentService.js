global.APPENV = { PAGE_COUNT: 10 }

const chai = require('chai');
var expect = chai.expect;
const sinon = require('sinon');
const db = require('../../models/index');
const contentService = require("../../services/contentService");
const basePattern = require("../testdata/pattern/basePattern");


describe('contentService test', () => {
  before(async () => {
    bp = new basePattern();
    await bp.genTestData();
  });

  describe('test : addTitle', () => {
    it('作品タイトルの追加', async () => {
      const user_id = 1;
      const test_data = {
        title_name: "test",
        sub_title: "テスト",
        abbreviation: "テス"
      }
      const title_data = await contentService.createTitle(user_id, test_data);
      expect(title_data.get("name")).to.equals("test");
      
    });
  });

  describe('test : addChara', () => {
    it('キャラクターの追加', async () => {
      const user_id = 1;
      const test_data = {
        title_id: 1,
        chara_name: "テストくん",
        nickname: "テスト",
        name_type: 1,
      }
      const chara_data = await contentService.createChara(user_id, test_data);
      expect(chara_data.get("name")).to.equals("テストくん");
      
    });
  });

  describe('test : getTitle', () => {
    it('作品情報の取得', async () => {
      const title_id = 1;
      const title_data = await contentService.getTitle(title_id);
      expect(title_data.get("name")).to.equals("test");
    });
  });

  describe('test : getChara', () => {
    it('キャラクター情報の取得', async () => {
      const chara_id = 1;
      const chara_data = await contentService.getChara(chara_id);
      expect(chara_data.get("name")).to.equals("テストくん");
    });
  });

  describe('test : searchContentChara', () => {
    it('キャラクター情報の検索', async () => {
      const keyword = "トく";
      const chara_data = await contentService.searchContentChara(keyword);
      expect(chara_data[0].get("name")).to.equals("テストくん");
    });
  });

  describe('test : searchContentTitle', () => {
    it('作品情報の検索', async () => {
      const keyword = "es";
      const title_data = await contentService.searchContentTitle(keyword);
      expect(title_data[0].get("name")).to.equals("test");
    });
  });

});