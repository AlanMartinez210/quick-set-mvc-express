const hashHelper = require("../common/helper/hashHelper");
const vo_matching = require("../viewObjects/matching");
const loginForm = require("../form/loginForm");
const registerForm = require("../form/registerForm");
const matchingService = require("../services/matchingService");
const dateHelper = require("../common/helper/dateHelper");


/**
 * マッチングは募集または予定を公開してる側【A】と
 * 応募または依頼をする側【B】の二つの立場がある。
 *
 * ステートの移り変わりとして
 * <1>
 * 【B】が【A】の出している (募集/予定) に (依頼/応募) をする。
 * 【B】(依頼/応募) -> 【A】(募集/予定)
 * この時、マッチングのステートは
 * 【B】(申請中) | 【A】(保留中)
 *  ->【B】は(依頼/応募)の"取り下げ"と【A】に対しての"質問"が行える。
 *  ->【A】は(依頼/応募)に対し"承諾"と"拒否"と【B】に対しての"質問"が行える。
 * ※1:募集一覧からにはまだ【A】の(募集/予定)は表示されている。
 * ※2:(応募/依頼)の削除をした場合、このセットはマッチング履歴へ移動し、"(応募/依頼)は削除されました。"と記述する。
 *
 * <2>
 * 【A】が【B】からの (依頼/応募) に対して (承諾/拒否) をする。
 * 【A】(承諾/拒否) -> 【B】
 *  =>【A】が承諾した場合、マッチングのステートは
 * 【B】(マッチング済み) | 【A】(マッチング済み)
 *  ->【B】は"キャンセル"と"質問"が行える。
 *  ->【A】は"キャンセル"と"質問"が行える。
 * ※募集人数に達した場合、募集一覧から表示されなくなる。
 * ※(応募/依頼)の削除はマッチングをキャンセルしなければ行えない。
 * (カレンダーから削除すると警告が表示される)
 *
 *  =>【A】が拒否した場合、このセットはマッチング履歴へと移動する。
 * また、(依頼/応募)が拒否された場合、マッチング履歴のこのセットに
 * "承認されませんでした"の記述を行う。
 *
 * <3>
 * 【A】または【B】がマッチング済みをキャンセルする。
 * 【A】(キャンセル) <-> 【B】(キャンセル)
 *  -> キャンセルした両者のこのセットはマッチング履歴へと移動する。
 * また、マッチング履歴のこのセットに"キャンセルされました"の記述を行う。
 * ※募集人数に満たない為、再度募集一覧に表示される。
 */

/**
 * マッチングの管理の表示
 *
 * @param {*} req
 * @param {*} res
 */
exports.index = function(req, res, next){
  var render_obj = res.render_obj;
  render_obj.contentId = "matching";
  render_obj.title = "マッチング管理";

  Promise.all([
    matchingService.getMatchingList(req),
    matchingService.getMatchingHistoryList(req),
  ])
  .then(results=>{
    const matchingList = results[0];
    const matchingHist = results[1];
    render_obj.bodyData = new vo_matching.matching_page({
      matching_item: matchingList.map(obj=>{
        return new vo_matching.matching_item({
          matching_id: obj.matching_id,
          icon_url: obj.icon_url,
          user_name: obj.user_name,
          status_type: obj.status_type,
          datetime_info: obj.datetime_info
        });
      }),
      matching_history_item: matchingHist.map(obj=>{
        return new vo_matching.matching_history_item({
          matching_id: obj.matching_id,
          icon_url: obj.icon_url,
          user_name: obj.user_name,
          date_info: obj.date_info
        });
      }),
    });
    res.render('mypage/matching', render_obj);
  }).catch(next);

}