const hashHelper = require("../common/helper/hashHelper");
const vo_matching = require("../viewObjects/matching");
const matchingService = require("../services/matchingService");
const dateHelper = require("../common/helper/dateHelper");
const sessionHelper = require("../common/helper/sessionHelper");


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
  const render_obj = res.render_obj;
  render_obj.contentId = "matching";
  render_obj.title = "マッチング管理";

  const user_id = sessionHelper.getUserId(req);
  Promise.all([
    matchingService.getMatchingList(user_id),
    matchingService.getMatchingHistoryList(user_id),
  ])
  .then(results=>{
    const matchingList = results[0];
    const matchingHistoryList = results[1];
    render_obj.bodyData = new vo_matching.matching_page(user_id, matchingList, matchingHistoryList);
    res.render('mypage/matching', render_obj);
  }).catch(next);

}
