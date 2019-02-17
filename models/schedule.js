const dateHelper = require("../common/helper/dateHelper");
const enumShotType = require('../services/c2link4DiService').enumShotType();
const enumDataPassType = require('../services/c2link4DiService').enumDataPassType();

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Schedule = sequelize.define('Schedule', {
    user_id: DataTypes.INTEGER,
    schedule_type: DataTypes.INTEGER,
    group_year: DataTypes.INTEGER,
    group_month: DataTypes.INTEGER,
    date_key: {
      type: DataTypes.DATE,
      field: "date_key",
      get(){
        return dateHelper.getDate(this.getDataValue('date_key'));
      },
      set(v){
        return this.setDataValue('date_key', v.toDate())
      }
    },
    time_from: DataTypes.STRING,
    time_to: DataTypes.STRING,
    shot_type:{
      type: DataTypes.TINYINT.UNSIGNED,
      get(){
        return enumShotType.getObj(this.getDataValue('shot_type'));
      }
    },
    event_name: DataTypes.STRING,
    event_url: DataTypes.STRING,
    cost: DataTypes.STRING,
    num: DataTypes.STRING,
    cos_chara: DataTypes.JSON,
    remarks: DataTypes.STRING,
    allow_recruit_flg: DataTypes.BOOLEAN,
    self_payment_flg: DataTypes.BOOLEAN,
    allow_notice_flg: DataTypes.BOOLEAN,
    data_pass_type: {
      type: DataTypes.TINYINT.UNSIGNED,
      get(){
        return enumDataPassType.getObj(this.getDataValue('data_pass_type'));
      }
    }
  }, {
    getterMethods:{
      createdAt(){ return dateHelper.getDate(this.created_at) },
      updatedAt(){ return dateHelper.getDate(this.updated_at) },

      prefectures(){
        const Schedule_prefectures = this.getDataValue('Schedule_prefectures')||[];
        return Schedule_prefectures.map(v=>v.toJSON());
      },
      tags(){
        const Schedule_tags = this.getDataValue('Schedule_tags')||[];
        return Schedule_tags.map(v=>v.toJSON());
      },

      // 関連した都道府県データからIDのみを抽出する。
      getArrPrefById(){
        const schedule_prefectures = this.getDataValue('Schedule_prefectures') || [];
        return schedule_prefectures.map(v=>v.toJSON().prefecture_id);
      },

      // 関連したタグデータから名称のみを抽出する。
      getArrTagByName(){
        const schedule_tags = this.getDataValue('Schedule_tags') || [];
        return schedule_tags.map(v=> {
          const Tag = v.toJSON().Tag;
          return Tag && Tag.tag_name || {};
        });
      }
    },
    timestamps: false
  });

  Schedule.associate = function(models) {
    // スケジュールタグとの結合
    //models.Schedule_tag.belongsTo(this, { foreignKey: "schedule_id", targetKey: "id" })
    this.hasMany(models.Schedule_tag, { foreignKey: "schedule_id", targetKey: "id" })
    // スケジュール都道府県との結合
    //models.Schedule_prefecture.belongsTo(this, { foreignKey: "schedule_id", targetKey: "id" })
    this.hasMany(models.Schedule_prefecture, { foreignKey: "schedule_id", targetKey: "id" })

    // スケジュールとの結合
    models.Matching.belongsTo(this, { foreignKey: "schedule_id", targetKey: "id" })
    this.hasMany(models.Matching, { foreignKey: "schedule_id", targetKey: "id" })

    // ユーザーとの結合
    this.belongsTo(models.User, {as: "user"})
  };

  /* == class method == */

  /**
   * スケジュール一覧を取得します。
   *
   * @param {*} user_id
   * @param {*} year
   * @param {*} month
   * @param {*} options
   */
  Schedule.getScheduleList = function(user_id, year, month, options = {}){
    options.where = {
      user_id: user_id,
      group_year: year,
      group_month: month,
    };
    return this.findAll(options);
  };

  /**
   * スケジュール情報を取得します。
   *
   * @param {*} schedule_id
   * @param {*} options
   */
  Schedule.getSchedule = function(schedule_id, options = {}){
    return this.findByPk(schedule_id, options);
  };

  /**
   * 指定した年の対象ユーザーの月別のスケジュール投稿数を取得します
   *
   * @param {string} user_id 対象ユーザー
   * @param {number} year 年 YYYY
   */
  Schedule.getMonthScheduleNumList = function(user_id, year, options = {}){
    options.where = {
      user_id: user_id,
      group_year: year
    };
    options.raw = true;
    options.attributes = ["group_month", [sequelize.fn('count', "id"), 'count']]
    options.group = ["group_year", "group_month"]
    return this.findAll(options);
  };

  /**
   * スケジュールの新規登録を行います。
   *
   * @param {*} schedule_data
   * @param  {...any} param [tag_model, option]
   */
  Schedule.createSchedule = function(schedule_data, model, options = {}){
    return sequelize.transaction(async t => {
      options.transaction = t;

      // タグデータが渡されたときだけ、タグの登録を行う。
      if(schedule_data.tag_field){
        schedule_data.Schedule_tags = await convertTags(schedule_data, model, options);
      }
      // 都道府県データがあるときだけ処理を行う。
      if(schedule_data.prefectures_field){
        schedule_data.Schedule_prefectures = schedule_data.prefectures_field.map(v => { return {prefecture_id: v} })
      }

      options.include = [ "Schedule_tags", "Schedule_prefectures" ];
      return await this.create(schedule_data, options);

    });
  };

  /**
   * スケジュールの更新を行います。
   *
   * @param {*} schedule_data
   * @param {*} model
   * @param {*} options
   */
  Schedule.updateSchedule = function(schedule_data, model, options = {}){
    return sequelize.transaction(async t => {

      // スケジュールの更新(必ずuser_idを添える)
      const update_result = await this.update(schedule_data, {
        where: {
          [sequelize.Op.and]: [
            { id: schedule_data.schedule_id },
            { user_id: schedule_data.user_id }
          ]
        },
        transaction: t
      });

      options = {transaction : t}
      await Promise.all([
        model.Schedule_tag.deleteScheduleTag(schedule_data.schedule_id, options),
        model.Schedule_prefecture.deleteSchedulePref(schedule_data.schedule_id, options)
      ])

      // タグデータが渡されたときだけ処理を行う。
      if(schedule_data.tag_field){
        schedule_data.Schedule_tags = await convertTags(schedule_data, model, options)
        schedule_data.Schedule_tags = schedule_data.Schedule_tags.map(v => Object.assign(v, {schedule_id: schedule_data.schedule_id}));
        await model.Schedule_tag.createScheduleTag(schedule_data.Schedule_tags, options)
      }
      // 都道府県データがあるときだけ処理を行う。
      if(schedule_data.prefectures_field){
        schedule_data.Schedule_prefectures = schedule_data.prefectures_field.map(v => { return { schedule_id: schedule_data.schedule_id, prefecture_id: v} });
        await model.Schedule_prefecture.createSchedulePrefs(schedule_data.Schedule_prefectures, options);
      }

      return update_result
    });
  }

  /**
   * スケジュールの削除を行います。
   *
   * @param {*} schedule_id
   * @param {*} options
   */
  Schedule.deleteSchedule = function(schedule_id, model, options = {}){
    return sequelize.transaction(async t => {
      options.transaction = t;

      await Promise.all([
        model.Schedule_tag.deleteScheduleTag(schedule_id, options),
        model.Schedule_prefecture.deleteSchedulePref(schedule_id, options)
      ]);

      options.where = { id: schedule_id }
      return await this.destroy(options);
    })
  }



  /**
   * 募集一覧を取得
   *
   * @param {*} searchParam
   */
  Schedule.getRecruitList = function(user_id, search_param, options = {}){
    const page_count = global.APPENV.PAGE_COUNT;
    options = ModelOption.recruitList(user_id, search_param, options);
    options.limit = page_count;
    options.offset = page_count * ((search_param.page?search_param.page:1)-1);
    options.order = [["date_key", "ASC"]];
    options.attributes = {
      // ブックマーク有無の条件
      include: [[sequelize.literal(`EXISTS(select * from Recruit_bookmarks where schedule_id = schedule.id and user_id = ${user_id} )`), 'bookmark_flg']]
    };
    return this.findAndCountAll(options);
  }
  /* == instance method == */


  /** option set **/
  const ModelOption = {
    /**
     * 募集一覧のoption
     */
    recruitList: (user_id, search_param, options={})=>{
      options.include = [{ all: true, nested: true}];
      options.distinct = true;
      const where = options.where = {};
      if(search_param.schedule_type){
        where.schedule_type = search_param.schedule_type;
      }
      if(search_param.search_date_from){
        if(!where.date_key)where.date_key = {};
        where.date_key[sequelize.Op.gte] = dateHelper.max(search_param.search_date_from, dateHelper.getDateOnly()).toDate();
      }else{
        if(!where.date_key)where.date_key = {};
        where.date_key[sequelize.Op.gte] = dateHelper.getDateOnly().toDate();
      }
      if(search_param.search_date_to){
        if(!where.date_key)where.date_key = {};
        where.date_key[sequelize.Op.lte] = search_param.search_date_to.toDate();
      }
      if(search_param.shot_type){
        where.shot_type = search_param.shot_type;
      }
      if(search_param.prefectures_field){
        if(!where[sequelize.Op.and]) where[sequelize.Op.and] = [];
        where[sequelize.Op.and].push(
          sequelize.literal(`EXISTS(
            select *
            from schedule_prefectures
            where schedule_prefectures.prefecture_id in (${search_param.prefectures_field.join(",")})
            and   schedule_prefectures.schedule_id   =  schedule.id
          )`)
        );
      }
      if(search_param.search_tag){
        if(!where[sequelize.Op.and]) where[sequelize.Op.and] = [];
        where[sequelize.Op.and].push(
          sequelize.literal(`EXISTS(
            select *
            from  schedule_tags
            join  tags on tags.id = schedule_tags.tag_id
            where tags.tag_name = '${search_param.search_tag}'
            and   schedule_tags.schedule_id = schedule.id
          )`)
        );
      }
      if(user_id){
        // user_idがある場合は、未応募の募集のみ表示
        if(!where[sequelize.Op.and]) where[sequelize.Op.and] = [];
        where[sequelize.Op.and].push(
          sequelize.literal(`NOT EXISTS( \
            select * \
            from   matchings \
            where  schedule_id = schedule.id \
            and    matchings.user_id = ${user_id} \
          )`)
        );
      }
      if(search_param.is_bookmark && user_id){
        if(!where[sequelize.Op.and]) where[sequelize.Op.and] = [];
        where[sequelize.Op.and].push(
          sequelize.literal(`EXISTS(
            select *
            from  Recruit_bookmarks
            where Recruit_bookmarks.schedule_id = schedule.id
            and   Recruit_bookmarks.user_id = ${user_id}
          )`)
        );
      }
      return options;
    }
  }


  return Schedule;
};

/**
 * スケジュールタグをタグIDに変換します。
 *
 * @param {*} data
 * @param {*} model
 * @param {*} options
 */
const convertTags = function(data, model, options = {}){
  const pa = data.tag_field.map(v => {
    return model.Tag.upsertTag(v, options);
  });
  return Promise.all(pa)
};
