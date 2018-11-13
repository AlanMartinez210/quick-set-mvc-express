/**
 * グローバル変数を初期化します
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res, next)=>{
  // 都道府県の一覧
  const ALL_PREF_LIST = [];
  const ALL_PREF_ID_MAP = {};
  const prefList = require("jp-prefecture").getAllPref();
  for(var pref of prefList){
    ALL_PREF_LIST.push(ALL_PREF_ID_MAP[pref.id] = pref);
  }

  // お知らせタイプ
  const NOTICE_TYPE = {
    info: 1, // お知らせ
    event: 2, // イベント
    worn: 3 // 注意勧告
  };


  // 撮影タイプ一覧
  // postテーブルのpost_typeの種類
  const SHOT_TYPE = {EVENT: 1, PORTLAIT:2, PRIVATE:3, STUDIO:4, OTHERS:99};
  const SHOT_TYPE_ID_MAP = {};
  const SHOT_TYPE_LIST = [
    {id: SHOT_TYPE.EVENT, name: "イベント"},
    {id: SHOT_TYPE.PORTLAIT, name: "ポートレート"},
    {id: SHOT_TYPE.PRIVATE, name: "個人撮影"},
    {id: SHOT_TYPE.STUDIO, name: "スタジオ撮影"},
    {id: SHOT_TYPE.OTHERS, name: "その他"},
  ];
  SHOT_TYPE_LIST.forEach(v=>{
    SHOT_TYPE_ID_MAP[v.id] = v;
  });

  // マッチングステータス一覧
  // matchingテーブルのstatus_idの種類
  const MATCHING_STATUS_ID_MAP = {
    REQUEST: 1, // 申請中、
    MATCHING: 3, // マッチング済み
    REJECT : 5, // 却下済み
  };

  const send_matching_stats_map = {};     // 自分から依頼したマッチングのステータス
  const receive_matching_stats_map = {};  // 自分に依頼されたマッチングのステータス
  send_matching_stats_map[MATCHING_STATUS_ID_MAP.REQUEST] = {id: MATCHING_STATUS_ID_MAP.REQUEST, name: "申請中"};
  receive_matching_stats_map[MATCHING_STATUS_ID_MAP.REQUEST] = {id: MATCHING_STATUS_ID_MAP.REQUEST, name: "保留中"};
  send_matching_stats_map[MATCHING_STATUS_ID_MAP.MATCHING] = {id: MATCHING_STATUS_ID_MAP.REQUEST, name: "マッチング中"};
  receive_matching_stats_map[MATCHING_STATUS_ID_MAP.MATCHING] = {id: MATCHING_STATUS_ID_MAP.REQUEST, name: "マッチング中"};
  send_matching_stats_map[MATCHING_STATUS_ID_MAP.REJECT] = {id: MATCHING_STATUS_ID_MAP.REJECT, name: "却下済み"};
  receive_matching_stats_map[MATCHING_STATUS_ID_MAP.REJECT] = {id: MATCHING_STATUS_ID_MAP.REJECT, name: "却下済み"};

  MATCHING_STATUS_ID_MAP.getSendMathingStatus = (id)=>{
    return send_matching_stats_map[id];
  };
  MATCHING_STATUS_ID_MAP.getReceiveMathingStatus = (id)=>{
    return send_matching_stats_map[id];
  }


  // ユーザータイプ一覧
  const USER_TYPE_ID_MAP = {
    COSPLAYER: 1,
    CAMERAMAN: 2,
  };

  // スケジュールタイプ一覧
  const SCHEDULE_TYPE_ID_MAP = {
    COSPLAYER: 1,
    CAMERAMAN: 2,
  };


  global.C2LINK = {
    ALL_PREF_LIST,
    ALL_PREF_ID_MAP,
    SHOT_TYPE_LIST,
    SHOT_TYPE_ID_MAP,
    MATCHING_STATUS_ID_MAP,
    USER_TYPE_ID_MAP,
    SCHEDULE_TYPE_ID_MAP,
    NOTICE_TYPE
  };
  next();
};


// vvvvv Todo: 検討中
global.PAGE_COUNT = 10;  // 1ページの件数
