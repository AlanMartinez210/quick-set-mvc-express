const express = require('express');
const router = express.Router();

const validate = require('./common/middleware/validateForm');

const controllerPath = './controllers/';
const mypageController = require(`${controllerPath}mypageController`);
const profileController = require(`${controllerPath}profileController`);
const scheduleController = require(`${controllerPath}scheduleController`);
const reviewController = require(`${controllerPath}reviewController`);
const siteController = require(`${controllerPath}siteController`);
const matchingController = require(`${controllerPath}matchingController`);
const requestController = require(`${controllerPath}requestController`);
const sampleImageController = require(`${controllerPath}sampleImageController`);
const extServiceController = require(`${controllerPath}extServiceController`);
const messageController = require(`${controllerPath}messageController`);
const messageRoomController = require(`${controllerPath}messageRoomController`);
const recruitlistController = require(`${controllerPath}recruitlistController`);
const recruitDetailController = require(`${controllerPath}recruitDetailController`);
const userController = require(`${controllerPath}userController`)

/** =============================
 * ユーザー操作
 ================================*/
/**
 * ログアウト
 */
router.post('/api/logout', userController.postLogout);

/**
 * アカウントの削除
 */
router.post('/api/delete', validate.check(require('./form/deleteUserForm')), validate.result, userController.postUserDelete);


/** =============================
 * マイページ
 ================================*/
/* マイページの表示 index */
router.get('/mypage', mypageController.index);

/* プロフィール設定の表示 index */
router.get('/mypage/profile', profileController.index);　/* プロフィール編集の表示 */

/* プロフィール設定の登録/編集 postProfile */


/* サイトの設定の表示 index */
router.get('/mypage/site', siteController.index);

/* サイトの設定の登録/編集 postSiteSetting */

/* サンプル写真の設定の表示 index */
router.get('/mypage/sampleImage', sampleImageController.index);

/* サンプル写真の設定の登録/編集 postSampleImage */


// 一つのコントローラーで作る
/* 所持機材設定(カメラマンのみ) index */

/* 所持機材設定(カメラマンのみ)の登録/編集 postEquipment */

/* 所持衣装設定(コスプレイヤーのみ) index */

/* 所持機材設定(コスプレイヤーのみ)の登録/編集 postCostume */

/* 外部サービス連携の表示 index */
router.get('/mypage/extService', extServiceController.index);　

/* 外部サービス連携の表示 postExtService */

/** =============================
 * スケジュール
 ================================*/

/* スケジュールの表示 index */
router.get('/mypage/schedule', scheduleController.index);　

/* 選択した年月のスケジュールの表示 getSelectScheduleList */
router.get('/mypage/schedule/:year(\\d{4})/:month(\\d{1,2})', scheduleController.getSelectScheduleList);　

/* 選択した日付のスケジュールを取得 getSchedule */
router.get('/mypage/schedule/:schedule_id', scheduleController.getSchedule);　

/* スケジュールの登録/編集 postSchedule */
router.post('/mypage/schedule/cos',validate.check(require('./form/postCosScheduleForm')), validate.result, scheduleController.postSchedule);

router.post('/mypage/schedule/cam',validate.check(require('./form/postCamScheduleForm')), validate.result, scheduleController.postSchedule);

/* スケジュールの削除 deleteSchedule */
router.delete('/mypage/schedule',validate.check(require('./form/deleteScheduleForm')), validate.result, scheduleController.deleteSchedule);

/** =============================
 * レビューの管理
 ================================*/

/* レビューの表示(未レビュー一覧と、レビュー履歴の表示) */
router.get('/mypage/review', reviewController.index);

/* 自分がしたレビュー履歴の取得 getReviewHistory */
router.get('/mypage/review/sendList', reviewController.getReviewHistory);


/* 自分にされたレビュー履歴の取得 getRevieweeHistory */
router.get('/mypage/review/recieveList', reviewController.getRevieweeHistory);


/* レビューの登録/編集 postReview */
router.post('/mypage/review',validate.check(require('./form/postReviewForm')), validate.result, reviewController.postReview);


/** =============================
 * マッチングの管理
 ================================*/

/* マッチング一覧の表示(マッチング一覧と、マッチング履歴の表示) */

router.get('/mypage/matching', matchingController.index);

/* マッチング履歴の取得(マッチング履歴の取得) getMatchingHistory */
// router.get('/mypage/matching/history', matchingController.getMatchingHistory);

/* 依頼/応募する postRequest */
router.post('/mypage/matching/request',validate.check(require('./form/postRequestForm')), validate.result, requestController.postRequest);

/* マッチングの承諾 postConsent */
router.post('/mypage/matching/consent',validate.check(require('./form/postConsentForm')), validate.result, requestController.postConsent);

/* マッチングを却下する postReject */
router.post('/mypage/matching/reject',validate.check(require('./form/postRejectForm')), validate.result, requestController.postReject);

/** =============================
 * メッセージ
 ================================*/

/* メッセージ */
router.get('/message', messageController.index);

/* チャットルーム */
router.get('/message/room', messageRoomController.index);　
router.post('/api/room/postMessage', validate.check(require('./form/postMessageForm')), validate.result, messageRoomController.postMessage);　

/** =============================
 * 募集/予定
 ================================*/

/* 募集/予定一覧の表示 index */
router.get('/recruitlist', recruitlistController.index);　

/* 当日の募集/予定の表示 indexToday */
router.get('/recruitlist/today', recruitlistController.indexToday);　

/* 募集/予定の検索 getSearchRecruit */
router.post('/recruitlist/search', validate.check(require('./form/getSearchRecruitListForm')), validate.result, recruitlistController.getSearchRecruit);

/* 募集/予定のブックマークの設定/解除 PostRecruitBookMark */
router.post('/recruitlist/bookmark', validate.check(require('./form/postRecruitBookmarkForm')), validate.result, recruitlistController.postRecruitBookmark);


/* 募集/予定の詳細表示 */
router.get('/recruitlist/detail/:recruit_list_id', recruitDetailController.getRecruitDetail)


module.exports = router;
