'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Matchings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      schedule_id: {
        type: Sequelize.BIGINT.UNSIGNED
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED
      },
      to_user_id: {
        type: Sequelize.BIGINT.UNSIGNED
      },
      status_id: {
        type: Sequelize.INTEGER
      },
      last_message: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
    }).then(()=>{
      queryInterface.addIndex(
        'Matchings',
        ['user_id', 'schedule_id'],
        {indicesType: 'UNIQUE'}
      );
      queryInterface.addIndex(
        'Matchings',
        ['to_user_id', 'schedule_id'],
        {}
      );

      // リクエストしたときにto_user_id に postsの作成者を設定する
      queryInterface.sequelize.query(`
        create trigger set_to_user_id before insert on Matchings
        for each row
        set new.to_user_id = (select user_id from schedules where id = new.schedule_id);
      `);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Matchings');
  }
};
