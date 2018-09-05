'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AuthTwitters', {
      token: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      token_secret: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED
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
    return queryInterface.dropTable('AuthTwitters');
  }
};
