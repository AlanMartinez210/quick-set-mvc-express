//var validateList = require('../custom_modules/validateList');
var loginPattern = [
  {
    test:{userid:'araki',password:'araki'},
    result:{error:false},
  },
  {
    test:{userid:'araki'},
    result:{error:true},
  },
  {
    test:{userid:'araki'},
    result:{error:true},
  },
  {
    test:{},
    result:{error:true},
  },
  {
    test:{userid:'arakiarakiarakiarakiarakiarakiarakiarakiarakiaraki1',password:'araki'},
    result:{error:true},
  },
  {
    test:{userid:'araki',password:'arakiarakiarakiarakiarakiarakiarakiarakiarakiaraki1'},
    result:{error:true},
  },
];
for(var i in loginPattern){
//  var res = validateList.doValidates('login',loginPattern[i].test);
//  console.log(res.error === loginPattern[i].result.error);
}
