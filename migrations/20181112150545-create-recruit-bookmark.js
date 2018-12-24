'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Recruit_bookmarks', {
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
    return queryInterface.dropTable('Recruit_bookmarks');
  }
};
