const env = process.env.NODE_ENV;
// グローバルオブジェクトのセット
const appConfig = require(__dirname + '/config/env.json');
console.log('---- start env ------', env);
global.APPENV = Object.assign(appConfig.common, appConfig[env]);

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const session = require('express-session');
const errorHelper = require('./common/helper/errorHelper');

const app = express();

// CORSを許可する
app.use(require('./common/middleware/corsFilter'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * setting session param
*/

app.use(session({
  secret: 'c2link',
  resave: false,
  saveUninitialized: false,
  cookie: {
//    httpOnly: true,
//    secure: true,
    maxAge:  365 * 24 * 60 * 60 * 1000,
  }
}));

/**
 * view engine setup
*/

//viewのルートを設定
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'pug');


/**
 * setting favicon
*/
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


/**
 * setting logger
*/
app.use(logger('dev'));


/**
 * Twitter Auth
*/

//const auth = require('./custom_modules/passportTwitter');
//const twitter = require('./routes/oauth/twitter');
//const pp = auth.passport;
//app.use(pp.initialize());
//app.use(pp.session());
//app.get('/auth/twitter', pp.authenticate('twitter'));
//app.get('/auth/twitter/callback', pp.authenticate('twitter', { failureRedirect: '/register' }), twitter.success);
//app.use('/twitter', twitter);


/**
 * コントローラー共通処理モデルの呼び出し
 */
app.use(require('./common/middleware/responseObjectDefer'));

/**
 * generate routing
*/
app.use(require('./routes'));


/**
 * error handler
 */
app.use(notfoundErrorHandler);
app.use(errorObjectWrapper);
app.use(logHandler);

app.use(require('./common/middleware/clientErrorHandler'));
app.use(require('./common/middleware/errorHandler'));


/**
 * catch 404 and forward to error handler
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function notfoundErrorHandler(req, res, next){
  next(new errorHelper({status: 404}))
}

/**
 * throw、またはキャッチされたErrorオブジェクトをerrorHelperオブジェクトでラップします。
 * 
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function errorObjectWrapper(err, req, res, next){
  // errorHelperオブジェクトか判定します。
  if(err.name !== 'ErrorHelper'){
    // errorHelperのcustamErrorObjectに置き換えます。
    err = new errorHelper(err instanceof Error ? {err: err} : {});
  }

  next(err);
}

/**
 * エラー情報のログ出力をハンドリングします。
 * 
 * @param {*} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function logHandler(err, req, res, next){
  if(env === 'development'){
    console.debug("development error message: ", err.message);
    console.debug("development error obj: ", err);
    // console.error("error stack log: ", err.stack);
  }
  else{
    // ログファイルに書き出します。
  }
  next(err);
}

module.exports = app;
