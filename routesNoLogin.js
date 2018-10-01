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
router.get('/debug', (req,res,next)=>{
  res.render('../test/debug/debugMenu',{
    self: true,
    user: req.session.user,
    users:[],
  });
});
router.get('/debug/loginCosplayer', (req,res,next)=>{
  var userRepo = require('./repository/userRepository');
  var sessionHelper = require('./common/helper/sessionHelper');
  userRepo().create({id:999998, user_name:"コスプレイヤー", password: "pass", email:"cos@cos.com", user_type:1}).then(row=>{
    sessionHelper.setUserData(req, row);
    res.redirect('/');
  }).catch(row=>{
    userRepo().findOne({where:{id:999998}}).then(row=>{
      sessionHelper.setUserData(req, row);
      res.redirect('/');
    });
  })
});
router.get('/debug/loginCameraman', (req,res,next)=>{
  var userRepo = require('./repository/userRepository');
  var sessionHelper = require('./common/helper/sessionHelper');
  userRepo().create({id:999999, user_name:"テストカメラマン", password: "pass", email:"cam@cam.com", user_type:2}).then(row=>{
    sessionHelper.setUserData(req, row);
    res.redirect('/');
  }).catch(row=>{
    userRepo().findOne({where:{id:999999}}).then(row=>{
      sessionHelper.setUserData(req, row);
      res.redirect('/');
    });
  })
});

router.get('/debug/cameramansPost', (req,res,next)=>{
  var scheduleRepository = require('./repository/CustomRepository/scheduleRepository');
  var koyomi = require('koyomi');
  var days = koyomi.getCalendarData('2018/8');
  var pros = days.map(v=>{
    if(v.ghost) return null;
    req.form_data = {
      date_data: v.year + "/" + v.month + "/" + v.day,
      shot_type: 2,
      time_from: "10:00",
      time_to: "11:00",
      event_name: "テストイベント",
      remarks: "備考",
      prefectures:[],
      tags:[],
    };
    return scheduleRepository.postSchedule(req).then(()=>{});
  }).filter(x=>{return !!x});

  Promise.all(pros).then((row)=>{
    res.redirect("/debug");
  }).catch(console.log);
});
