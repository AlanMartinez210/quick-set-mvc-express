'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const test_user = 

    return queryInterface.bulkInsert('users', test_user, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
};
