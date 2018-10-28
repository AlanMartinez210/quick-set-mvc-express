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

exports.getScheduleListResult = async(data = {schedule_type:2, /* date_key: "20180808" */}, options = {page:1/* page, orderBy */}) => {
  var select = ` select schedules.*,
                 users.id as user_id, users.icon_url as user_icon_url,
                 concat('[', ifnull((
                   select GROUP_CONCAT(JSON_OBJECT('id', schedule_prefectures.prefecture_id) SEPARATOR ',')
                   from   schedule_prefectures
                   where  schedule_prefectures.schedule_id = schedules.id
                 ),""), ']') as prefecture_json,
                 concat('[', ifnull((
                   select GROUP_CONCAT(JSON_OBJECT('id', schedule_tags.tag_id, 'name', tags.tag_name ) SEPARATOR ',')
                   from   schedule_tags join tags on schedule_tags.tag_id = tags.id
                   where  schedule_tags.schedule_id = schedules.id
                 ), ''), ']') as tags_json
               `;
  options = Object.assign({
    orderBy: [["schedules.date_key", "asc"], ["schedules.updated_at", "desc"], ["users.id", "desc"]],
    limit: PAGE_COUNT,
    offset: (options.page-1)*PAGE_COUNT,
  }, options);
  const schedule_list = await getScheduleList(select, data, options);
  console.log('\naaaaprefeaaa\n', schedule_list);
  schedule_list.forEach(row=>{
    row.prefecture_json = JSON.parse(row.prefecture_json);
    if(Array.isArray(row.prefecture_json)){
      row.prefecture_json.forEach(obj=>{
        obj.name = global.C2LINK.ALL_PREF_ID_MAP[obj.id].name;
      });
    }
    row.prefecture_json = JSON.stringify(row.prefecture_json);
    return row;
  });
  return schedule_list;
};

exports.getScheduleListCount = (data = {user_type:0, date_key: "20180808"}, options = {}) => {
  var select = "select count(1) as cnt ";
  return getScheduleList(select, data, options);

};
