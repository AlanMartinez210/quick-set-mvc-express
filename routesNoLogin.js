const express = require('express');
const router = express.Router();

const controllerPath = './controllers/';

const publicController = require(`${controllerPath}publicController`);
const userController = require(`${controllerPath}userController`);

const validate = require('./common/middleware/validateForm');


// ルートにきたときの処理
router.get('/', (req,res,next)=>{
  /* マイページの表示 */
  if(req.session.user) res.redirect('/mypage');
  else res.redirect('/register');
});

/* 新規登録ページの表示 */
router.get('/register', userController.index);
/* ユーザー新規登録処理 */
router.post('/api/register', validate.check(require('./form/registerForm')), validate.result, userController.postRegister);
/* ログイン処理 */
router.post('/api/login', validate.check(require('./form/loginForm')), validate.result, userController.postLogin);

///* 運営情報の表示 */
//router.get('/public/adminInfo', publicController.getAdminInfo);
//
///* プライバシーポリシーの表示 index */
//router.get('/public/privacyPolicy', publicController.getPrivacyPolicy);
//
///* 利用者様のデータについての表示 index */
//router.get('/public/aboutUserData', publicController.getAboutUserData);
//
///* お問い合わせの表示 index */
//router.get('/public/contact', publicController.getContact);

module.exports = router;

/* デバッグページ */
const basePattern = require("./testdata/pattern/basePattern");
const userRepository = require("./repository/userRepository");
const hashHelper = require("./common/helper/hashHelper");

router.get('/test/cam', (req, res, next) => {
  const sessionHelper = require('./common/helper/sessionHelper');
  const bp = new basePattern();
  bp.genTestData()
  .then(results => {
    return userRepository().getUserByUserKeyOrEmail("test.cam_1_cs@c2link.mail.com", hashHelper("password1"));
  })
  .then(results => {
    sessionHelper.setUserData(req, results[0]);
    res.redirect('/');
  })
  .catch(err => {
    next(err);
  })
});

router.get('/test/cos', (req, res, next) => {
  const sessionHelper = require('./common/helper/sessionHelper');
  const bp = new basePattern();
  bp.genTestData()
  .then(results => {
    return userRepository().getUserByUserKeyOrEmail("test.cos_1_cs@c2link.mail.com", hashHelper("password1"));
  })
  .then(results => {
    sessionHelper.setUserData(req, results[0]);
    res.redirect('/');
  })
  .catch(err => {
    next(err);
  })
});