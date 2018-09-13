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
      schedule_group: {
        type: Sequelize.STRING(6),
        allowNull: false,
        comment: '年月を基準としたスケジュールの範囲'
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
//     .then(() => {
//        queryInterface.addIndex('Schedules', {
//          unique: true,
// //         fields: ['user','date_key', 'seq_id'], 同日に複数投稿したい場合はこっちにする
//          fields: ['user_id','date_key'],
//        });
//       //  queryInterface.addIndex('Schedules', {
//       //    unique: false,
//       //    fields: ['date_key', 'seq_id'],
//       //  });
//     })
    // .then(e=>{
    //   queryInterface.sequelize.query(`
    //     create trigger insert_date_key before insert on Schedules
    //     for each row
    //       begin
    //         DECLARE $date_key varchar(8);
    //         DECLARE $seq_id int;

    //         /* date_keyを設定する */
    //         select new.date_key into $date_key;

    //         /* seqnumを設定する */
    //         select ifnull(max(seq_id),0) + 1 into $seq_id
    //         from Schedules where user_id = new.user_id and date_key = $date_key;

    //         set new.date_key = $date_key;
    //         set new.seq_id = $seq_id;
    //       end
    //       ;
    //   `);
    // });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Schedules');
  }
};
