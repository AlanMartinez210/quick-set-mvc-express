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
        type: Sequelize.BIGINT.UNSIGNED
      },
      schedule_type: {
        type: Sequelize.INTEGER
      },
      date_key: {
        type: Sequelize.STRING
      },
      seq_id: { // ユーザー、日付毎の連番
        type: Sequelize.BIGINT.UNSIGNED
      },
      time_from: {
        type: Sequelize.STRING
      },
      time_to: {
        type: Sequelize.STRING
      },
      shot_type: {
        type: Sequelize.INTEGER
      },
      event_name: {
        type: Sequelize.STRING
      },
      event_url: {
        type: Sequelize.STRING
      },
      cost: {
        type: Sequelize.INTEGER
      },
      num: {
        type: Sequelize.INTEGER
      },
      cos_chara: {
        type: Sequelize.STRING
      },
      remarks: {
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
    })
    .then(() => {
       queryInterface.addIndex('Schedules', {
         unique: true,
//         fields: ['user','date_key', 'seq_id'], 同日に複数投稿したい場合はこっちにする
         fields: ['user_id','date_key'],
       });
       queryInterface.addIndex('Schedules', {
         unique: false,
         fields: ['date_key', 'seq_id'],
       });
    })
    .then(e=>{
      queryInterface.sequelize.query(`
        create trigger insert_date_key before insert on Schedules
        for each row
          begin
            DECLARE $date_key varchar(8);
            DECLARE $seq_id int;

            /* date_truncを設定する */
            select new.date_key into $date_key;

            /* seqnumを設定する */
            select ifnull(max(seq_id),0) + 1 into $seq_id
            from Schedules where user_id = new.user_id and date_key = $date_key;

            set new.date_key = $date_key;
            set new.seq_id = $seq_id;
          end
          ;
      `);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Schedules');
  }
};
