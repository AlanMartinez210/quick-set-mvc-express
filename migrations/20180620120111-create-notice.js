'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      notice_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING(1000)
      },
      islogin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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
    return queryInterface.dropTable('Notices');
  }
};
