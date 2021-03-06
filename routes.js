const express = require('express');
const router = express.Router();

const controllerPath = './controllers/';
const formPath = './form/';

const validate = require('./common/middleware/validateForm');
const loginCheck = require('./common/middleware/loginCheck');
const sessionHelper = require('./common/helper/sessionHelper');
const errorHelper = require('./common/helper/errorHelper');

const mypageController = require(`${controllerPath}mypageController`);
const profileController = require(`${controllerPath}profileController`);
const scheduleController = require(`${controllerPath}scheduleController`);
const reviewController = require(`${controllerPath}reviewController`);
const siteController = require(`${controllerPath}siteController`);
const matchingController = require(`${controllerPath}matchingController`);
const sampleImageController = require(`${controllerPath}sampleImageController`);
const extServiceController = require(`${controllerPath}extServiceController`);
const messageController = require(`${controllerPath}messageController`);
const messageRoomController = require(`${controllerPath}messageRoomController`);
const recruitlistController = require(`${controllerPath}recruitlistController`);
const recruitDetailController = require(`${controllerPath}recruitDetailController`);
const publicController = require(`${controllerPath}publicController`);
const userController = require(`${controllerPath}userController`)
const costumeController = require(`${controllerPath}costumeController`);
const equipmentController = require(`${controllerPath}equipmentController`);
const contentController = require(`${controllerPath}contentController`);

const contentForm = require(`${formPath}contentForm`);
const costumeForm = require(`${formPath}costumeForm`);
const equipmentForm = require(`${formPath}equipmentForm`);
const userForm = require(`${formPath}userForm`);
const scheduleForm = require(`${formPath}scheduleForm`);
const siteForm = require(`${formPath}siteForm`);
const recruitlistForm = require(`${formPath}recruitlistForm`);
const reviewForm = require(`${formPath}reviewForm`);
const matchingForm = require(`${formPath}matchingForm`);
const messageForm = require(`${formPath}messageForm`);
const publicForm = require(`${formPath}publicForm`);
const recruitDetailForm = require(`${formPath}recruitDetailForm`);

// ルートにきたときの処理
router.get('/', (req,res,next)=>{
  /* マイページの表示 */
  if(req.session.user) res.redirect('/mypage');
  else res.redirect('/register');
});


/** =============================
 * ユーザー操作
 ================================*/

/* 新規登録ページの表示 */
router.get('/register', (req,res,next)=>{ sessionHelper.isLogin(req) ? res.redirect('/') : next() }, userController.index);

/* ユーザー新規登録 */
router.post('/api/register', validate.check(userForm.post), validate.result, userController.postRegister);

/* ログイン */
router.post('/api/login', validate.check(userForm.postLogin), validate.result, userController.postLogin);

/** ログアウト */
router.post('/api/logout', loginCheck, userController.postLogout);

/** アカウントの削除 */
router.delete('/api/delete', loginCheck, validate.check(userForm.delete), validate.result, userController.postUserDelete);

/** お知らせ getNoticeData */
router.get('/api/notice', publicController.getNoticeData);

/** パスワードを忘れた */
router.get('/forget/password', publicController.forgetPassword);
router.post('/forget/password', validate.check(publicForm.forgetPassword), validate.result, publicController.postForgetPassword);

/** ユーザーIDを忘れた/登録したメールアドレスが分からない */
router.get('/forget/userid', publicController.forgetUserid);
router.post('/forget/userid', validate.check(publicForm.forgetUserId), validate.result, publicController.postForgetUserid);

/** =============================
 * マイページ
 ================================*/
/* マイページの表示 index */
router.get('/mypage', loginCheck, mypageController.index);

/* プロフィール設定の表示 index */
router.get('/mypage/profile', loginCheck, profileController.index);　/* プロフィール編集の表示 */

/* プロフィール情報の取得 */
router.get('/mypage/profile/:user_id', loginCheck, validate.check(userForm.getUser), validate.result, userController.getUserData);

/* プロフィール設定の編集 postProfile */
router.post('/mypage/profile', loginCheck, validate.check(userForm.putProfile), validate.result, userController.postUserUpdate);

/* プロフィールアイコン画像の登録 postProfileIcon */
router.post('/mypage/profile/profileIcon', loginCheck, userController.postProfileIcon);

/* カバー背景画像の登録 postProfileIcon */
router.post('/mypage/profile/bgCover', loginCheck, userController.postBgCover);


/* サイトの設定の表示 index */
router.get('/mypage/site', loginCheck, siteController.index);

/* サイトの設定の登録/編集 postSiteSetting */
router.post('/mypage/site/', loginCheck, validate.check(siteForm.post), validate.result, siteController.postSiteSetting);

/* サンプル写真の設定の表示 index */
router.get('/mypage/sampleImage', loginCheck, sampleImageController.index);

/* サンプル写真の設定の登録 postSampleImage */
router.post('/mypage/sampleImage', loginCheck, sampleImageController.postSampleImage);

/* サンプル写真の設定の削除 deleteSampleImage */
router.delete('/mypage/sampleImage', loginCheck, validate.check(userForm.deleteSampleImage), validate.result, sampleImageController.deleteSampleImage);

/* 所持機材設定(カメラマンのみ) index */
router.get('/mypage/equipment', loginCheck, equipmentController.index);

/* 所持機材設定(カメラマンのみ)の登録 postCreate */
router.post('/mypage/equipment', loginCheck, validate.check(equipmentForm.post), validate.result, equipmentController.postCreate);

/* 所持機材設定(カメラマンのみ)の削除 delete */
router.delete('/mypage/equipment', loginCheck, validate.check(equipmentForm.post), validate.result, equipmentController.delete);


/* 所持衣装設定(コスプレイヤーのみ) index */
router.get('/mypage/costume', loginCheck, costumeController.index);

/* 所持衣装一覧の取得(コスプレイヤーのみ) list */
router.get('/mypage/costume/list', loginCheck, costumeController.list);

/** 所持衣装情報の取得 getCostume */
router.get('/mypage/costume/:costume_id', loginCheck, validate.check(costumeForm.getCostume), validate.result, costumeController.getCostume)

/* コスプレ衣装設定(コスプレイヤーのみ)の登録 postCreate */
router.post('/mypage/costume', loginCheck, validate.check(costumeForm.post), validate.result, costumeController.postCreate);

/* コスプレ衣装設定(コスプレイヤーのみ)の編集 putUpdate */
router.put('/mypage/costume', loginCheck, validate.check(costumeForm.put), validate.result, costumeController.putUpdate);

/* コスプレ衣装設定(コスプレイヤーのみ)の削除 delete */
router.delete('/mypage/costume', loginCheck, validate.check(costumeForm.delete), validate.result, costumeController.delete);



// /* コスプレ作品登録 */
// router.post('/mypage/costume/createtitle', loginCheck, validate.check(costumeForm.postRegistTitle), validate.result, costumeController.createContentTitle);

// /* コスプレキャラクター登録 */
// router.post('/mypage/costume/createchara', loginCheck, validate.check(costumeForm.postRegistChara), validate.result, costumeController.createContentChara);

/** =============================
 * 運営情報
 ================================*/

/* 運営情報の表示 */
router.get('/adminInfo', publicController.getAdminInfo);

/* プライバシーポリシーの表示 index */
router.get('/privacyPolicy', publicController.getPrivacyPolicy);

/* 利用者様のデータについての表示 index */
router.get('/aboutUserData', publicController.getAboutUserData);

/* お問い合わせの表示 index */
router.get('/contact', publicController.getContact);

/* お問い合わせの送信 postContact */
router.post('/contact', validate.check(publicForm.postContact), validate.result, publicController.postContact);

/* 外部サービス連携の表示 postExtService */
router.get('/mypage/extService', loginCheck, extServiceController.index);　

/** =============================
 * 作品/キャラクター情報
 ================================*/

/* 作品/キャラクターの取得 info */
router.get('/api/content/:type', validate.check(contentForm.info), validate.result, contentController.info);

/* 作品名/キャラクター名の検索 search */
router.get('/api/content/search/:type', validate.check(contentForm.search), validate.result, contentController.search);

/* 作品情報の登録 create */
router.post('/api/content/title', validate.check(contentForm.postRegistTitle), validate.result, contentController.createContentTitle);

/* キャラクター情報の登録 create */
router.post('/api/content/chara', validate.check(contentForm.postRegistChara), validate.result, contentController.createContentChara);

/* 作品情報の更新 update */
router.put('/api/content/title', validate.check(contentForm.updateTitle), validate.result, contentController.update);

/* キャラクター情報の更新 update */
router.put('/api/content/chara', validate.check(contentForm.updateChara), validate.result, contentController.update);

/** =============================
 * スケジュール
 ================================*/

/* スケジュールの表示 index */
router.get('/mypage/schedule', loginCheck, scheduleController.index);　

/* 選択した年月のスケジュールの表示 getSelectScheduleList */
router.get('/mypage/schedule/:year(\\d{4})/:month(\\d{1,2})', loginCheck, scheduleController.getSelectScheduleList);　

/* 選択した日付のスケジュールを取得 getSchedule */
router.get('/mypage/schedule/:schedule_id', loginCheck, validate.check(scheduleForm.getScheduleData), validate.result, scheduleController.getSchedule);　

/* スケジュールの登録 postSchedule */
router.post('/mypage/schedule/cos', loginCheck, validate.check(scheduleForm.postByCos), validate.result, scheduleController.postSchedule);
router.post('/mypage/schedule/cam', loginCheck, validate.check(scheduleForm.postByCam), validate.result, scheduleController.postSchedule);

router.put('/mypage/schedule/cos', loginCheck, validate.check(scheduleForm.putByCos), validate.result, scheduleController.putSchedule);
router.put('/mypage/schedule/cam', loginCheck, validate.check(scheduleForm.putByCam), validate.result, scheduleController.putSchedule);


/* スケジュールの削除 deleteSchedule */
router.delete('/mypage/schedule', loginCheck, validate.check(scheduleForm.delete), validate.result, scheduleController.deleteSchedule);

/** =============================
 * レビューの管理
 ================================*/

/* レビューの表示(未レビュー一覧と、レビュー履歴の表示) */
router.get('/mypage/review', loginCheck, reviewController.index);

/* 自分がしたレビュー履歴の取得 getReviewHistory */
router.get('/mypage/review/history', loginCheck, validate.check(reviewForm.getReviewHistory), validate.result, reviewController.getReviewHistory);

/* 自分にされたレビュー履歴の取得 getRevieweeHistory */
router.get('/mypage/reviewee/history', loginCheck, validate.check(reviewForm.getRevieweeHistory), validate.result, reviewController.getRevieweeHistory);

/* レビューの登録/編集 postReview */
router.post('/mypage/review', loginCheck, validate.check(reviewForm.postReview), validate.result, reviewController.postReview);


/** =============================
 * マッチングの管理
 ================================*/

/* マッチング一覧の表示(マッチング一覧と、マッチング履歴の表示) */
router.get('/mypage/matching', loginCheck, matchingController.index);

/* マッチング履歴の取得(マッチング履歴の取得) getMatchingHistory */
router.get('/mypage/matching/history', loginCheck, validate.check(matchingForm.getMatchingHistory), validate.result, matchingController.getMatchingHistory);

/* 依頼/応募する postRequest */
router.post('/mypage/matching/request', loginCheck, validate.check(matchingForm.postReqest), validate.result, matchingController.postRequest);

/* マッチングの承諾 postConsent */
router.post('/mypage/matching/consent', loginCheck, validate.check(matchingForm.postConsent), validate.result, matchingController.postConsent);

/* マッチングを却下する postReject */
router.post('/mypage/matching/reject', loginCheck, validate.check(matchingForm.postReject), validate.result, matchingController.postReject);

/** =============================
 * メッセージ
 ================================*/

/* メッセージ */
router.get('/message', loginCheck, messageController.index);

/* チャットルーム */
router.get('/message/room', loginCheck, validate.check(messageForm.getMessage), validate.result, messageRoomController.index);　
router.post('/api/room/postMessage', loginCheck, validate.check(messageForm.postMessage), validate.result, messageRoomController.postMessage);　

/** =============================
 * 募集/予定
 ================================*/

/* 募集/予定一覧の表示 index */
router.get('/recruitlist/:type', loginCheck, validate.check(recruitlistForm.getRecruitlist), validate.result, recruitlistController.index);　

/* 募集/予定の検索 getSearchRecruit */
router.get('/recruitlist/:type/search', loginCheck, validate.check(recruitlistForm.getSearchRecruitlist), validate.result, recruitlistController.getSearchRecruit);

/* 募集/予定のブックマークの設定/解除 PostRecruitBookMark */
router.post('/recruitlist/bookmark', loginCheck, validate.check(recruitlistForm.postBookmark), validate.result, recruitlistController.postRecruitBookmark);

/** =============================
 * 募集/予定
 ================================*/

/* 募集/予定の詳細表示 */
router.get('/recruitdetail/:schedule_id', loginCheck, validate.check(recruitDetailForm.getRecruitDetail), validate.result, recruitDetailController.getRecruitDetail);

/**
 * 募集/予定の詳細の表示 entryOutSide
 * 外部からのアクセス専用
 *  */
router.get('/api/recruitdetail', recruitDetailController.entryOutSide)


/**
 * エラーリクエスト処理
 */
router.get('/:type/error', function(req, res, next){
  switch(Number(req.params.type)){
    case 500:
      next(new errorHelper());
      break;
    case 401:
    case 403:
      next(new errorHelper({status: 403}));
    default:
      next(new errorHelper({status: 404}));
  }
})


// ajax error test

// 500
/**
 * エラーリクエスト処理
 */
router.get('/t/e/:code/:logoutflg', function(req, res, next){
  console.log("error code:", req.params.code);
  next(new errorHelper({status: req.params.code, logout: Boolean(req.params.logoutflg)}));
})





/* デバッグページ */
const basePattern = require("./test/testdata/pattern/basePattern");
const matchingPattern = require("./test/testdata/pattern/matchingPattern");
const reviewPattern = require("./test/testdata/pattern/reviewPattern");
const db = require("./models/index");
const hashHelper = require("./common/helper/hashHelper");

router.get('/test/:type/:mode', (req, res, next) => {
  const sessionHelper = require('./common/helper/sessionHelper');
  const type = req.params.type;
  const data_mode = req.params.mode;

  const bp = new basePattern();

  if(type === "data"){
    switch(data_mode){
      case "init": 
        console.log("データタイプ -> 初期化 ");
        bp.trancateAll().then(() => res.redirect('/'));
        break;
      case "1":
        console.log("データタイプ -> 1 ユーザーデータのみ ");
        bp.genUserAndTags().then(() => res.redirect('/'));
        break;
      case "2":
        console.log("データタイプ -> 2 スケジュールデータ ");
        bp.genTestData().then(() => res.redirect('/'));
        break;
      case "3":
        console.log("データタイプ -> 3 全データ");
        break;
    }
  }else{
    const mail = `test.${type}_${data_mode}_cs@c2link.mail.com`;
    console.log(`${type} -> ${mail}`);
    db.User.getUserByUserKeyOrEmail(mail, hashHelper(`password${data_mode}`))
    .then(results => {
      sessionHelper.setUserData(req, results[0]);
      res.redirect('/');
    })

  }

});

module.exports = router;
