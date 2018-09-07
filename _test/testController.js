const dateHelper = require("../common/helper/dateHelper");
const calendarHelper = require("../common/helper/calendarHelper");
const scheduleController = require("../controllers/scheduleController");
const profileController = require("../controllers/profileController");
const testObj = require("./testSetObject");
const responseObjectDefer = require("../common/middleware/responseObjectDefer");
const globalVariables = require('../common/middleware/globalVariables')(console.log,console.log,console.log);

function testController(){
	// ミドルウェアをハックする。
	responseObjectDefer(testObj.req, testObj.res, testObj.next);
	const req = testObj.req;
	const res = testObj.res;
	const next = testObj.next;
  
	console.log("testController to start!!")
	console.log("")

	// VVVVVVVVVV テストするコントローラーのメソッドを書く VVVVVVVVVV
	
	// profileController.index(req,res,next);

	// scheduleController.index(req, res, next);

	// req.params.year = "2018";
	// req.params.month = "8";
	// scheduleController.getSelectScheduleList(req, res, next);

	// req.params.date_key = "20180809";
	// scheduleController.getSchedule(req, res, next);

	// req.form_data = {
	// 	date_key: "20180909",
  //   shot_type: 1,
  //   time_from: "15:00",
  //   time_to: "20:30",
  //   event_name: "テストイベント",
	// 	remarks: "テスト備考",

	// 	// cos_chara: [],
	// 	prefectures: [13, 15],
	// 	tags: ["カメラ"],
	// 	cost: 0,
  //   num: 0,
  //   event_url: "http://test.com",
	// }
	// scheduleController.postSchedule(req, res, next);

	// req.form_data = {
	// 	date_key: "20180809"
	// }
	// scheduleController.deleteSchedule(req, res, next);

	// profileController.index(req, res, next);


	// ^^^^^^^^^^ テストするコントローラーのメソッドを書く ^^^^^^^^^^

}

testController();
