'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Chats', {
      matching_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
      },
      seq_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED
      },
      to_user_id: {
        type: Sequelize.BIGINT.UNSIGNED
      },
      message: {
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
    }).then(e=>{
      // チャット発言時にシーケンスnoをインクリメントする
      queryInterface.sequelize.query(
        ` create trigger insert_chats_pk before insert on chats
          for each row set new.seq_id = (select ifnull(max(seq_id),0) + 1 from chats where matching_id = new.matching_id );`
      );
      // チャット発言時にリクエストの最新メッセージを更新する
      queryInterface.sequelize.query(
        ` create trigger insert_chats_message before insert on chats
          for each row
          begin update matchings set last_message = new.message where id = new.matching_id;
          end;`
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Chats');
  }
};
