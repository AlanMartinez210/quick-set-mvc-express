'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      matching_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      review_from: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      review_to: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      review_type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      review_comment: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Reviews');
  }
};
