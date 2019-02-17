'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schedule_costumes', {
      schedule_id: {
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      costume_id: {
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
        comment: 'コスチュームID' 
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
    return queryInterface.dropTable('Schedule_costumes');
  }
};
