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
        type: Sequelize.TINYINT.UNSIGNED,
        comment: '都道府県番号' 
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Schedule_prefectures');
  }
};
