const dateHelper = require('../common/helper/dateHelper');
const calendarHelper = require('../common/helper/calendarHelper');
const tagRepository = require('../repository/tagRepository')();
const scheduleRepository = require('../repository/scheduleRepository')();
const scheduleService = require('../services/scheduleService');

// console.log(dateHelper.getToday());
// console.log(dateHelper.getToday("YYYYMM"));
// console.log(dateHelper.getToday("YYYY/MM/DD"));

// console.log(dateHelper.getCurrentYear(2));
// console.log(dateHelper.getCurrentMonth(6));
// console.log(dateHelper.getCurrentDay());

// console.log(dateHelper.getDate([2018, 02, 16]));
// console.log(dateHelper.getDate([2018, 2]));
// console.log(dateHelper.getDate([2018]));
// console.log(dateHelper.getDate([2018, 2], "YYYYMMDD"));
// console.log(dateHelper.getDate([2018, 2], "YYYYMMDD", false));

// console.log(calendarHelper.getCurrentCalendar());

// console.log(`dateHelper.dateToArray("2018-01-02")`, dateHelper.dateToArray("2018-01-02"));
// console.log(`dateHelper.dateToArray("2018-01-02T10:11:12.909")`, dateHelper.dateToArray("2018-01-02T10:11:12.909"));

// console.log(`dateHelper.dateToObject("2018-08-10")`, dateHelper.dateToObject("2018-08-10"));
// console.log(`dateHelper.dateToObject({year:2018, month:7, date:10})`, dateHelper.dateToObject({year:2018, month:7, date:10}));
// console.log(`dateHelper.dateToObject({year:2018, month:8, date:10}, {diffMonth:-1})`, dateHelper.dateToObject({year:2018, month:8, date:10}, {diffMonth:-1}));

// tagRepository.getTagRowByName([""])
// .then(res => {
// 	console.log(res);
// })


// tagRepository.getTagRowById([2, 3, 8])
// .then(res => {
// 	console.log(res);
// });

// 

// scheduleService.getMonthSchedule("999999", "2018", "08")
// .then(result => {
// 	console.log(result);
// });

scheduleService.getScheduleData("999999", "20180809")
.then(result => {
	console.log(result);
});
