'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Equipment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      equipment_type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      maker_type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      maker_name: {
        type: Sequelize.STRING(256)
      },
      equipment_name: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      use_year: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Equipment');
  }
};