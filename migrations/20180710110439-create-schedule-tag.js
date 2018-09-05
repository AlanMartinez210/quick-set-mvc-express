'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schedule_tags', {
      schedule_id: {
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      tag_id: {
        primaryKey: true,
        type: Sequelize.BIGINT
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Schedule_tags');
  }
};
