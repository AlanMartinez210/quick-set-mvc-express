'use strict';
const dateHelper = require("../common/helper/dateHelper");


module.exports = {
  up: (queryInterface, Sequelize) => {
    const testArr = [];
    for(var i=1;i<=10;i++){
      var initdatacam = {
        user_id: 1,
        schedule_type: 2,
        schedule_group: "201809",
        date_key: "",
        event_name: "",
        shot_type: 1,
        remarks: "テストスケジュール"
      }
      var initdatacos = {
        user_id: 2,
        schedule_type: 1,
        schedule_group: "201809",
        date_key: "",
        event_name: "",
        shot_type: 1,
        remarks: "テストスケジュール"
      }
      initdatacam.date_key = dateHelper.createDate(2018, 9, i).toDate();
      initdatacam.event_name = "テストイベント" + i;
      initdatacos.date_key = dateHelper.createDate(2018, 9, i).toDate();
      initdatacos.event_name = "テストイベント" + i;
      testArr.push(initdatacam);
      testArr.push(initdatacos);
    }
    return queryInterface.bulkInsert('schedules', testArr, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('schedules', null, {});
  }
};
