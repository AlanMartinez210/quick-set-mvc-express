'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Content_charas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      content_title_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(256),
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING(256)
      },
      name_type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      create_user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
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
    return queryInterface.dropTable('Content_charas');
  }
};