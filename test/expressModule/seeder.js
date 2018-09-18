const {sequelize, User, Schedule, } = require('../../models');

const create_user = [];
const create_schedule = [];
/**
 * この機能で作成したデータを全て削除する
 */
exports.allDestroy = async()=>{
  await Promise.all([
    await User.destroy({where:{id: create_user.map(v=>v.id)}}),
    await Schedule.destroy({where:{id: create_schedule.map(v=>v.id)}}),
  ]);
};

/**
 * ユーザーを作成する
 */
exports.createUser = async(userObj = {user_key:"テストユーザーcos", user_type: 1, password: "tesuto_user?"}) => {
  let user = await User.create(userObj);
  user = await User.findOne({where:{id:user.id}, raw:true});
  create_user.push(user);
  return user;
};

/**
 * スケジュールを作成する
 * ScheduleServiceが完成したらそっちにする
 */
exports.createSchedule = async(scheduleObj = {user_id:user1.id,schedule_type: user1.user_type,date_key: date,}) =>{
  let schedule = await Schedule.create(scheduleObj, {raw:true});
  schedule = await Schedule.findOne({where:{id:schedule.id}, raw:true});
  create_schedule.push(schedule);
  return schedule;
};
