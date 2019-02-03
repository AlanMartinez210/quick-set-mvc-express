'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      matching_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      review_from: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      review_to: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false
      },
      review_type: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      review_comment: {
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
    }).then(e=>{
      queryInterface.sequelize.query(
        `create trigger set_reviews_to_user_id before insert on Reviews
         for each row
         begin
          DECLARE $matching_from_user_id int;
          DECLARE $matching_to_user_id int;

          select user_id into $matching_from_user_id
          from matchings where id = new.matching_id;
          select to_user_id into $matching_to_user_id
          from matchings where id = new.matching_id;

          if($matching_from_user_id != new.review_from) then
            set new.review_to = $matching_from_user_id;
          else
            set new.review_to = $matching_to_user_id;
          end if;
        end `
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Reviews');
  }
};
