'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      user_key: {
        type: Sequelize.STRING(12)
      },
      user_name: {
        type: Sequelize.STRING(50)
      },
      password: {
        type: Sequelize.STRING(256)
      },
      email: {
        type: Sequelize.STRING(255)
      },
      icon_url: {
        type: Sequelize.STRING(255)
      },
      user_type: {
        type: Sequelize.TINYINT.UNSIGNED
      },
      tags: {
        type: Sequelize.JSON
      },
      prefectures: {
        type: Sequelize.JSON
      },
      expiration_date: {
        type: Sequelize.DATE
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
      indexes:[{
        unique: true,
        fields: ['user_key']
      },{
        unique: true,
        fields: ['email']
      }]
    }).then(e=>{
      queryInterface.sequelize.query(
        `create trigger set_user_key before insert on users
         for each row
         begin
          DECLARE $user_key varchar(50);
          DECLARE $dup_cnt int;

          select coalesce(new.user_key,new.user_name) into $user_key;
          select count(1) into $dup_cnt from users where user_key = $user_key;
          /* user_keyが重複する場合 または 英数_以外が入力されている場合に自動設定 */
          while $dup_cnt != 0 or $user_key regexp \'^[A-Za-z0-9_]+$\' = 0 do
            select substring(MD5(rand()),1,12) into $user_key;
            select count(1) into $dup_cnt from users where user_key = $user_key;
          end while;
          set NEW.user_key = $user_key;
         end; `
      );
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
