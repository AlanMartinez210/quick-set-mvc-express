const chai = require('chai');
const sinon = require('sinon');
const sequelize = require('../../models/index').sequelize;
const equipmentService = require("../../services/equipmentService");
const basePattern = require("../testdata/pattern/basePattern");

describe('equipmentService test', () => {
  before(async () => {
    bp = new basePattern();
    await bp.genTestData();
  });

    describe('scenario test1', () => {
    it('機材登録1', async () => {
      await equipmentService.create(1,{
        equipment_type: 1,
        maker_type: 1,
        maker_name: "",
        equipment_name: "すごいカメラ",
        use_year : "1"
      });
      await sequelize.query("select id,user_id,equipment_type,maker_type,maker_name,equipment_name,use_year from equipment where id = '1'", {type: sequelize.QueryTypes.SELECT})
      .then(row=>{
        chai.assert.deepEqual(row[0], {
          id: 1,
          user_id : 1,
          equipment_type: 1,
          maker_type: 1,
          maker_name: "",
          equipment_name: "すごいカメラ",
          use_year: 1
        });
      });
    });
    it('機材登録2', async () => {
      await equipmentService.create(1,{
        equipment_type: 2,
        maker_type: 99,
        maker_name: "うなぎ株式会社",
        equipment_name: "うなぎレンズ",
        use_year : "3"
      });
      await sequelize.query("select id,user_id,equipment_type,maker_type,maker_name,equipment_name,use_year from equipment where id = '2'", {type: sequelize.QueryTypes.SELECT})
      .then(row=>{
        chai.assert.deepEqual(row[0], {
          id: 2,
          user_id : 1,
          equipment_type: 2,
          maker_type: 99,
          maker_name: "うなぎ株式会社",
          equipment_name: "うなぎレンズ",
          use_year: 3
        });
      });
    });
    it('機材削除1', async () => {
      await equipmentService.delete(1, 1);
      await sequelize.query("select count(*) as count from equipment", {type: sequelize.QueryTypes.SELECT})
      .then(row=>{
        chai.assert.deepEqual(row[0], {
          count: 1
        });
      });
      await sequelize.query("select id from equipment", {type: sequelize.QueryTypes.SELECT})
      .then(row=>{
        chai.assert.deepEqual(row[0], {
          id: 2
        });
      });
    });
  });


});