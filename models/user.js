const dateHelper = require("../common/helper/dateHelper");
const prefectureHelper = require("../common/helper/prefectureHelper");
const errorHelper = require('../common/helper/errorHelper');

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_key: DataTypes.STRING,
    user_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    icon_url: DataTypes.STRING,
    bg_image_url: DataTypes.STRING,
    user_type: DataTypes.INTEGER,
    tags: DataTypes.JSON,
    prefectures: {
      type: DataTypes.JSON,
      field: "prefectures",
      get(){
        let pref = this.getDataValue('prefectures');
        if(pref){
          pref = pref.map(v=>  {
            return {pref_id: v, pref_name: prefectureHelper.getPrefectureNameById(v) }
          });
        }
        return pref;
      },
    },
    sample_image: DataTypes.JSON,
    expiration_date: {
      type: DataTypes.DATE,
      field: "expiration_date",
      get(){
        return this.getDataValue('expiration_date') && dateHelper.getDate(this.getDataValue('expiration_date'));
      },
      set(v){
        return this.setDataValue('expiration_date', v && v.toDate());
      }
    },
    allow_bookmark_notification: DataTypes.TINYINT.UNSIGNED,
    good_review_num: DataTypes.BIGINT.UNSIGNED,
    bad_review_num: DataTypes.BIGINT.UNSIGNED,
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) }
    },
    timestamps: false
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  /**
   * ユーザーIDからユーザーデータを取得する。
   *
   * @param {*} user_id
   * @param {*} options
   */
  User.getUserById = function(user_id, options = {}){
    return this.findById(user_id, options);
  };

  /**
   * ユーザーIDからユーザーデータを取得する。
   *
   * @param {*} user_id
   * @param {*} options
   */
  User.getUserByKey = function(user_key, options = {}){
    options.where = {
      user_key: user_key
    };
    return this.findOne(options);
  };

  /**
   * user_keyまたは、メールアドレスからユーザーデータを取得する。
   *
   * @param {*} key
   * @param {*} password
   * @param {*} options
   */
  User.getUserByUserKeyOrEmail = function(key, password, options = {}){
		options.where = {
			[sequelize.Op.or]: [
				{id: key},
				{user_key: key},
				{email: key}
			],
			[sequelize.Op.and]: [
				{password: password}
			]
		}
    return this.findAll(options)
  };

  /**
   * メールアドレスからユーザーを取得します。
   *
   * @param {*} email
   * @param {*} options
   */
  User.getUserByEmail = function(email, options = {}){
		options.where = { email: email };
		return this.getUserAll(options);
  };

  /**
   * すべてのユーザーを取得する。
   *
   * @param {*} options
   */
  User.getUserAll = function(options = {}){
		return this.findAll(options);
  };

  /**
   * 新しくユーザーを作成する。
   *
   * @param {*} user_data
   * @param {*} options
   */
  User.createUser = function(new_user_data, options = {}){
    return this.create(new_user_data, options)
  };

  /**
   * ユーザーデータのexpiration_dateに削除予定の日付を追加します。(実質削除処理)
   *
   * @param {*} user_id
   * @param {*} options
   */
  User.deleteUser = function(user_id, options = {}){
    options.where = { id: user_id }
    const delete_date = dateHelper.getDate().add(global.APPENV.EXPIRATION_DATE, "d");
		values = {
			expiration_date: delete_date
		}
		return this.update(values, options);
  };

  /**
   * 対象のユーザーの有効期限を削除します。
   *
   * @param {*} user_id
   * @param {*} options
   */
  User.deleteExpirationDate =  function(user_id, options = {}){
		return this.updateExpirationDate(user_id, null, options);
  };

  /**
   * 対象のユーザーの有効期限を更新します。
   *
   * @param {*} user_id
   * @param {moment} expiration_date
   * @param {*} options
   */
  User.updateExpirationDate = function(user_id, expiration_date, options = {}){
		options.where = { id: user_id }
    values = {
			expiration_date: expiration_date
		}
		return this.update(values, options);
	};

  return User;
};
