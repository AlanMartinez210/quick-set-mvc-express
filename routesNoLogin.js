const express = require('express');
const router = express.Router();
const isHelper = require('./common/helper/isHelper');

const controllerPath = './controllers/';

const publicController = require(`${controllerPath}publicController`);
const userController = require(`${controllerPath}userController`);

const recruitDetailController = require(`${controllerPath}recruitDetailController`);

const validate = require('./common/middleware/validateForm');


// ルートにきたときの処理
router.get('/', (req,res,next)=>{
  /* マイページの表示 */
  if(req.session.user) res.redirect('/mypage');
  else res.redirect('/register');
});

/* 新規登録ページの表示 */
router.get('/register', (req,res,next)=>{ isHelper.isLogin(req) ? res.redirect('/') : next() }, userController.index);
/* ユーザー新規登録処理 */
router.post('/api/register', validate.check(require('./form/postRegisterForm')), validate.result, userController.postRegister);
/* ログイン処理 */
router.post('/api/login', validate.check(require('./form/postLoginForm')), validate.result, userController.postLogin);

/* 運営情報の表示 */
router.get('/adminInfo', publicController.getAdminInfo);

/* プライバシーポリシーの表示 index */
router.get('/privacyPolicy', publicController.getPrivacyPolicy);

/* 利用者様のデータについての表示 index */
router.get('/aboutUserData', publicController.getAboutUserData);

/* お問い合わせの表示 index */
router.get('/contact', publicController.getContact);

/**
 * 募集/予定の詳細の表示 entryOutSide
 * 外部からのアクセス専用
 *  */
router.get('/api/recruitlist/detail', recruitDetailController.entryOutSide)

router.get('/api/notice', publicController.getNoticeData)

module.exports = router;

/* デバッグページ */
const basePattern = require("./test/testdata/pattern/basePattern");
const matchingPattern = require("./test/testdata/pattern/matchingPattern");
const reviewPattern = require("./test/testdata/pattern/reviewPattern");
const db = require("./models/index");
const hashHelper = require("./common/helper/hashHelper");

/**
 * テストでのデータやログインモードをデバックで使用します。
 *
 * type(ユーザー種別): cam(カメラマン)/cos(コスプレイヤー)
 * mode(データタイプ):
 *    u(ユーザーデータのみ)
 *    s(スケジュールデータ)
 *    m(マッチングデータ)
 *    r(レビューデータ)
 */
router.get('/test/:type/:mode', (req, res, next) => {
  const sessionHelper = require('./common/helper/sessionHelper');
  console.log(req.params);
  const user_type = req.params.type;
  const data_mode = req.params.mode;
  console.log("ユーザー種別 -> ", user_type);
  const mail = user_type == "cam" ? "test.cam_1_cs@c2link.mail.com" : "test.cos_1_cs@c2link.mail.com";

  if(data_mode == "u"){
    console.log("データタイプ -> ユーザーデータのみ ");
    const bp = new basePattern();
    bp.genUserAndTags().then(results => {
      return db.User.getUserByUserKeyOrEmail(mail, hashHelper("password1"));
    })
    .then(results => {
      sessionHelper.setUserData(req, results[0]);
      res.redirect('/');
    })
  }
  else if(data_mode == "s"){
    console.log("データタイプ -> スケジュールデータ ");
    const bp = new basePattern();
    bp.genTestData().then(results => {
      return db.User.getUserByUserKeyOrEmail(mail, hashHelper("password1"));
    })
    .then(results => {
      sessionHelper.setUserData(req, results[0]);
      res.redirect('/');
    })
  }
  else if(data_mode == "m"){
    console.log("データタイプ -> マッチングデータ ");
    const mp = new matchingPattern();
    mp.genMatchingData().then(results => {
      return db.User.getUserByUserKeyOrEmail(mail, hashHelper("password1"));
    })
    .then(results => {
      sessionHelper.setUserData(req, results[0]);
      res.redirect('/');
    })
  }
  else if(data_mode == "r"){
    console.log("データタイプ -> レビューデータ ");
    const rp = new reviewPattern();
    rp.genReviewData().then(results => {
      return db.User.getUserByUserKeyOrEmail(mail, hashHelper("password1"));
    })
    .then(results => {
      sessionHelper.setUserData(req, results[0]);
      res.redirect('/');
    })
  }


  // prom
  // .then(results => {

  // })
  // .then(results => {
  //   sessionHelper.setUserData(req, results[0]);
  //   res.redirect('/');
  // })
  // .catch(err => {
  //   next(err);
  // })
});
