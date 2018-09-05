// http://passportjs.org/guide/twitter/
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter');
var TWITTER_CONSUMER_KEY    = 'McduUlN9y7lrlZ1YftbaT65zW';
var TWITTER_CONSUMER_SECRET = 'sJLthQdvlVX2Yo6eOoYNOSCX8Qb7NpNjLXFzdkR14yyEp5gnT5';

// Sessionの設定
// http://passportjs.org/guide/configure/
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    authorizationURL: 'https://api.twitter.com/oauth/authenticate',
  	tokenURL: 'https://api.twitter.com/oauth/access_token',
    callbackURL: "http://c2link.site/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    passport.session.id = profile.id;

    // tokenとtoken_secretをセット
    profile.twitter_token = token;
    profile.twitter_token_secret = tokenSecret;
    process.nextTick(function () {
        return done(null, profile);
    });
  }
));

module.exports = {passport: passport};
