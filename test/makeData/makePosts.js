var faker = require('faker');

/* 100ユーザー作成 */
var users = require('../../models/users');
for(var i=0;i<100;i++){
  var data = {};
  data.type=((i%2)+1).toString();
  data.email = faker.internet.email();
  data.username = faker.name.firstName();
  data.password = "password";
  users.register(data);
}
