const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const session = require('express-session');
const errorHelper = require('./common/helper/errorHelper');
const globalValiable = require('./common/middleware/globalVariables');

const env = process.env.NODE_ENV;
const app = express();

console.log('---- start env ------', env);

// CORSを許可する
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, c2linkApiKey");
  next();
});

app.options('*', (req, res) => {
  console.log('----- cros ------');
  res.sendStatus(200);
});


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
 * global登録ミドルウェアの呼び出し
*/
app.use(globalValiable);

/**
 * view engine setup
*/

//viewのルートを設定
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'jade');


/**
 * setting logger
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

app.use(require('./common/middleware/requestObjectDefer'));
app.use(require('./common/middleware/responseObjectDefer'));

/**
 * generate routing
*/

// if(env == "development") app.use(require('./common/middleware/dev/debugSurvei'));

app.use(require('./routesNoLogin'));
/** login check */
app.use(require('./common/middleware/loginCheck'));
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
// TODO:他のページのコントローラができてからエラー処理を実装する
app.use((err, req, res, next) => {
  const render_obj = res.render_obj;
  console.log("response err ->", err);

  // TODO エラーヘルパーを通らない場合のajaxかそうでないかで切り分けが必要

  // ajaxエラー
  if(req.xhr){
    if(!err.isHelper){
      // エラーヘルパーを通っていなければ、オブジェクトを作成する。
      err = new errorHelper({http_status: 500});
      err.setWindowMsg("E00000");
    }
    res.status(err.http_status).json(err.errObj);
  }
  // 通常エラー
  else{
    // エラーヘルパーを通ってきてない場合は予期しないエラー
    if(!err.isHelper){
      err = new errorHelper({http_status: 500});
      err.setWindowMsg("E00000");
      res.status(err.http_status);
    }

    // redirect_toが指定されていたらredirect_toにリダイレクトさせる
    if(err.redirect_to){
      res.redirect(err.redirect_to);
      return;
    }

    // !!! set Express default err 
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    render_obj.contentId = "error";
    render_obj.title = "申し訳ございません|エラーページ";
    
    render_obj.bodyData = [ err, res.locals ];
    // render the error page
    res.render('../error', render_obj);

  }

  return;

});

module.exports = app;
