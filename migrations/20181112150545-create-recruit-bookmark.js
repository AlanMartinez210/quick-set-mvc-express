'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('recruit_bookmarks', {
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
      },
      schedule_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('recruit_bookmarks');
  }
};
