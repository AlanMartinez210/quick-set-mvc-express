'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Schedules', {
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
      schedule_type: {
        type: Sequelize.TINYINT,
        allowNull: false,
        comment: '表示するスケジュールを制御するための種別'
      },
      group_year: {
        type: Sequelize.INTEGER,
        comment: '年を基準としたスケジュールの範囲',
      },
      group_month: {
        type: Sequelize.INTEGER,
        comment: '月を基準としたスケジュールの範囲',
      },
      date_key: {
        type: Sequelize.DATE,
        allowNull: false
      },
      time_from: {
        type: Sequelize.STRING(5),
      },
      time_to: {
        type: Sequelize.STRING(5)
      },
      shot_type: {
        type: Sequelize.INTEGER
      },
      event_name: {
        type: Sequelize.STRING(50),
      },
      event_url: {
        type: Sequelize.STRING
      },
      cost: {
        type: Sequelize.INTEGER,
        comment: '費用'
      },
      num: {
        type: Sequelize.INTEGER,
        comment: '募集人数'
      },
      cos_chara: {
        type: Sequelize.BIGINT.UNSIGNED
      },
      remarks: {
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
    })
    .then(() => {
      queryInterface.addIndex('Schedules', {
        unique: false,
        fields: ['group_year','group_month'],
      })
      queryInterface.sequelize.query(`
        create trigger insert_date_key before insert on Schedules
        for each row
        begin
          set new.group_year  = date_format(new.date_key,'%Y')-0;
          set new.group_month = date_format(new.date_key,'%m')-0;
        end
      `);
      queryInterface.sequelize.query(`
        create trigger update_date_key before update on Schedules
        for each row
        begin
          set new.group_year  = date_format(new.date_key,'%Y')-0;
          set new.group_month = date_format(new.date_key,'%m')-0;
        end
      `);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Schedules');
  }
};
