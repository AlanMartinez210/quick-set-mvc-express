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
        type: Sequelize.STRING(50)
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
      bg_image_url: {
        type: Sequelize.STRING(255)
      },
      user_type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      tags: {
        type: Sequelize.JSON
      },
      prefectures: {
        type: Sequelize.JSON
      },
      sample_image: {
        type: Sequelize.JSON
      },
      expiration_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      allow_bookmark_notification: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1
      },
      good_review_num: {
        type: Sequelize.BIGINT.UNSIGNED,
        defaultValue: 0,
      },
      bad_review_num: {
        type: Sequelize.BIGINT.UNSIGNED,
        defaultValue: 0,
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
        `create trigger set_user_key before insert on Users
         for each row
         begin
          DECLARE $user_key varchar(50);
          DECLARE $dup_cnt int;

          select coalesce(new.user_key,new.user_name) into $user_key;
          select count(1) into $dup_cnt from Users where user_key = $user_key;
          /* user_keyが重複する場合 または 英数_以外が入力されている場合に自動設定 */
          while $dup_cnt != 0 or $user_key regexp \'^[A-Za-z0-9_]+$\' = 0 do
            select substring(MD5(rand()),1,12) into $user_key;
            select count(1) into $dup_cnt from Users where user_key = $user_key;
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
