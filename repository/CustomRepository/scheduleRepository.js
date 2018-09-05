const abstractRepository = require('../abstractRepository')();



const getScheduleList = (select, data, options)=>{
  var from   = ` from schedules join users on schedules.user_id = users.id and schedules.schedule_type = :schedule_type `;
  var where  = " where 1=1 ";
  if(data.date_key){
     where += ` and schedules.date_key = :date_key `;
  }
  var resultQuery = select + from + where;
  return abstractRepository.querySelect(resultQuery, data, options);
};

exports.getScheduleListResult = (data = {schedule_type:2, /* date_key: "20180808" */}, options = {page:1/* page, orderBy */}) => {
  var select = ` select schedules.*,
                 users.id as user_id, users.icon_url as user_icon_url,
                 concat('[', ifnull((
                   select GROUP_CONCAT(schedule_prefectures.prefecture_id SEPARATOR ',')
                   from   schedule_prefectures
                   where  schedule_prefectures.schedule_id = schedules.id
                 ),""), ']') as prefecture_json,
                 concat('[', ifnull((
                   select GROUP_CONCAT(schedule_tags.tag_id SEPARATOR ',')
                   from   schedule_tags
                   where  schedule_tags.schedule_id = schedules.id
                 ), ''), ']') as tags_json
               `;
  options.orderBy = options.orderBy || [["schedules.date_key", "asc"], ["schedules.updated_at", "desc"], ["users.id", "desc"]];
  options.limit = options.limit || PAGE_COUNT;
  options.offset = options.offset || ((options.page-1)*PAGE_COUNT);
  return getScheduleList(select, data, options);
};

exports.getScheduleListCount = (data = {user_type:0, date_key: "20180808"}, options = {}) => {
  var select = "select count(1) as cnt ";
  return getScheduleList(select, data, options);

};
