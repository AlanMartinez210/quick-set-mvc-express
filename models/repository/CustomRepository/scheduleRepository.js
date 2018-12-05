const dateHelper = require('../../../common/helper/dateHelper');
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
  if(data.search_param.shot_type){
    where += ` and schedules.shot_type = :shot_type `;
  }
  if(data.search_param.prefectures){
    where += ` and exists (
      select *
      from schedule_prefectures
      where schedule_prefectures.prefecture_id in (:prefectures)
      and   schedule_prefectures.schedule_id   =  schedules.id
   ) `;
  }

  var resultQuery = select + from + where;

  return abstractRepository.querySelect(resultQuery, {
    date_key: data.date_key.toDate(),
    schedule_type: data.schedule_type,
    shot_type: data.search_param.shot_type,
    search_date_from: raw_search_date_from,
    search_date_to: raw_search_date_to,
    prefectures: data.search_param.prefectures,
  }, options);
};

exports.getScheduleListResult = async(data, options = {}) => {

  var select = ` select schedules.*,
                 users.id as user_id, users.icon_url as user_icon_url,
                 concat('[', ifnull((
                   select GROUP_CONCAT(schedule_prefectures.prefecture_id SEPARATOR ',')
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
    offset: (options.page-1) * PAGE_COUNT,
  }, options);

  const schedule_list = await getScheduleList(select, data, options);

  schedule_list.forEach(row=>{
    row.tags = JSON.parse(row.tags_json);
    row.prefectures = JSON.parse(row.prefecture_json);
  });

  return schedule_list;
};

exports.getScheduleListCount = (data = {} , options = {}) => {
  var select = "select count(1) as cnt ";
  return getScheduleList(select, data, options);
};


/**
 * スケジュール詳細を取得
 *
 * @param {integer} schedule_id
 *
 */
exports.getScheduleDetail = ({schedule_id}, options = {})=>{
  const select = ` select
      schedules.id as schedule_id,
      users.bg_image_url as user_bg_image_url,
      users.id as user_id,
      users.user_name as user_user_name,
      users.icon_url as user_icon_url,
      users.good_review_num as user_good_review_num,
      users.bad_review_num as user_bad_review_num,
      schedules.date_key as schedule_date_key,
      schedules.shot_type as schedule_shot_type,
      schedules.event_name as schedule_event_name,
      schedules.event_url as schedule_event_url,
      concat('[', ifnull((
        select GROUP_CONCAT(schedule_prefectures.prefecture_id SEPARATOR ',')
        from   schedule_prefectures
        where  schedule_prefectures.schedule_id = schedules.id
      ),""), ']') as prefecture_json,
      concat('[', ifnull((
        select GROUP_CONCAT(JSON_OBJECT('id', schedule_tags.tag_id, 'name', tags.tag_name ) SEPARATOR ',')
        from   schedule_tags join tags on schedule_tags.tag_id = tags.id
        where  schedule_tags.schedule_id = schedules.id
      ), ''), ']') as schedule_tags_json,
      users.tags as user_tags,
      concat('[', ifnull((
        select GROUP_CONCAT(JSON_OBJECT('type', reviews.review_type, 'comment', reviews.review_comment ) SEPARATOR ',')
        from   reviews
        where  reviews.review_to = schedules.user_id
      ), ''), ']') as reviews_json,
      schedules.remarks as schedule_remarks
    from schedules
    join users on schedules.user_id = users.id
    where schedules.id = :schedule_id ;
  `;
  return abstractRepository.querySelect(select, {
    schedule_id: schedule_id
  }, options).then(rows => {
    rows.forEach(row=>{
      row.prefecture_json = JSON.parse(row.prefecture_json);
      row.schedule_tags_json = JSON.parse(row.schedule_tags_json);
      row.reviews_json = JSON.parse(row.reviews_json);
    });
    return rows;
  });
}
