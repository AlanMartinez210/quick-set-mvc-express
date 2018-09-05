'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schedule_prefectures', {
      schedule_id: {
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      prefecture_id: {
        primaryKey: true,
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Schedule_prefectures');
  }
};
