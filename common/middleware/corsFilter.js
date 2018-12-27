/**
 * CORS許可のフィルターを設定するミドルウェアです。
 */
module.exports = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, c2linkApiKey");
  next();
}