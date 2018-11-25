const dateHelper = require('../../common/helper/dateHelper');
const abstractRepository = require('../abstractRepository')();

const getScheduleList = (select, data, options)=>{
  const from   = ` from schedules join users on schedules.user_id = users.id and schedules.schedule_type = :schedule_type `;
  let where  = " where 1=1 ";
  let raw_search_date_from, raw_search_date_to;
  if(data.search_param.search_date_from){
    raw_search_date_from = data.search_param.search_date_from.toDate();
    where += ` and schedules.date_key >= :search_date_from `;
  }
  if(data.search_param.search_date_to){
    raw_search_date_to = data.search_param.search_date_to.toDate();
    where += ` and schedules.date_key <= :search_date_to `;
  }
  if(data.search_param.prefectures){
    where += ` and exists (select * from schedule_prefectures where schedule_prefectures.prefecture_id in (:prefectures) and schedule_prefectures.schedule_id = schedules.id ) `;
  }

  var resultQuery = select + from + where;
  return abstractRepository.querySelect(resultQuery, {
    date_key: data.date_key.toDate(),
    schedule_type: data.schedule_type,
    search_date_from: raw_search_date_from,
    search_date_to: raw_search_date_to,
    prefectures: data.search_param.prefectures,
  }, options);
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
  schedule_list.forEach(row=>{
    row.date_key = row.date_key;
    row.shot_type = global.C2LINK.SHOT_TYPE_ID_MAP[row.shot_type];
    row.tags = JSON.parse(row.tags_json);

    row.prefecture_json = JSON.parse(row.prefecture_json);
    if(Array.isArray(row.prefecture_json)){
      row.prefecture_json.forEach(obj=>{
        obj.name = global.C2LINK.ALL_PREF_ID_MAP[obj.id].name;
      });
    }
    row.prefectures = row.prefecture_json;
  });
  return schedule_list;
};

exports.getScheduleListCount = (data = {user_type:0, date_key: "20180808"}, options = {}) => {
  var select = "select count(1) as cnt ";
  return getScheduleList(select, data, options);

};
