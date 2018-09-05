var sessionHelper = require('../../common/helper/sessionHelper');


exports.run = run;


function run(req, res){
  // テストカメラマンにログイン
  userRepo().findOne({where:{id:999999}}).then(row=>{
    sessionHelper.setUserData(req, row);
  }).then(()=>{
    
  });


}
