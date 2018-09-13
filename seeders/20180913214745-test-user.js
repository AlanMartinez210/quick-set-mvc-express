'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const test_user = [
      {
        user_key: 'testcameraman',
        user_name: 'テストカメラマン',
        password: '07ae7cdfb9f2d4b94e3ad702aa511f86f658098bb01a6198e9dbbf32af11766a', //testcam
        email: "testcam@c2link.mail.jp",
        user_type: 2
      },
      {
        user_key: 'testcosplayer',
        user_name: 'テストコスプレイヤー',
        password: '07ae7cdfb9f2d4b94e3ad702aa511f86f658098bb01a6198e9dbbf32af11766a', // testcos
        email: "testcos@c2link.mail.jp",
        user_type: 1
      }
    ]

    return queryInterface.bulkInsert('users', test_user, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
};
