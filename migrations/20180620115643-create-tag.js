'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      tag_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      use_count: {
        type: Sequelize.BIGINT.UNSIGNED
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
    })
    .then(() => {
       queryInterface.addIndex('Tags', {
         unique: true,
         fields: ['tag_name'],
       });
    })

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tags');
  }
};
