const req_data = {
	session: {
		cookie:
		{ path: '/',
			_expires: '2019-07-19T08:52:48.854Z',
			originalMaxAge: 31536000000,
			httpOnly: true },
		user: {}
	},
	params:{},
	body:{},
	query:{}
}

const session_data = {
	cookie:
		{ path: '/',
			_expires: '2019-07-19T08:52:48.854Z',
			originalMaxAge: 31536000000,
			httpOnly: true },
	user: {}
}

const user_data = {
	id: 1,
	user_key: '9707eaafa609',
	user_name: 'テストカメラマン',
	password: 'pass',
	email: 'cam@cam.com',
	icon_url: null,
	user_type: 2,
	created_at: '2018-07-19T02:33:00.000Z',
	updated_at: '2018-07-19T02:33:00.000Z'
};

const calendar_date = [
	{ year: 2018, month: 9, day: 1, week: '土', holiday: '' },
	{ year: 2018, month: 9, day: 2, week: '日', holiday: '' },
	{ year: 2018, month: 9, day: 3, week: '月', holiday: '' },
	{ year: 2018, month: 9, day: 4, week: '火', holiday: '' },
	{ year: 2018, month: 9, day: 5, week: '水', holiday: '' },
	{ year: 2018, month: 9, day: 6, week: '木', holiday: '' },
	{ year: 2018, month: 9, day: 7, week: '金', holiday: '' },
	{ year: 2018, month: 9, day: 8, week: '土', holiday: '' },
	{ year: 2018, month: 9, day: 9, week: '日', holiday: '' },
	{ year: 2018, month: 9, day: 10, week: '月', holiday: '' },
	{ year: 2018, month: 9, day: 11, week: '火', holiday: '' },
	{ year: 2018, month: 9, day: 12, week: '水', holiday: '' },
	{ year: 2018, month: 9, day: 13, week: '木', holiday: '' },
	{ year: 2018, month: 9, day: 14, week: '金', holiday: '' },
	{ year: 2018, month: 9, day: 15, week: '土', holiday: '' },
	{ year: 2018, month: 9, day: 16, week: '日', holiday: '' },
	{ year: 2018, month: 9, day: 17, week: '月', holiday: '敬老の日' },
	{ year: 2018, month: 9, day: 18, week: '火', holiday: '' },
	{ year: 2018, month: 9, day: 19, week: '水', holiday: '' },
	{ year: 2018, month: 9, day: 20, week: '木', holiday: '' },
	{ year: 2018, month: 9, day: 21, week: '金', holiday: '' },
	{ year: 2018, month: 9, day: 22, week: '土', holiday: '' },
	{ year: 2018, month: 9, day: 23, week: '日', holiday: '秋分の日' },
	{ year: 2018, month: 9, day: 24, week: '月', holiday: '振替休日' },
	{ year: 2018, month: 9, day: 25, week: '火', holiday: '' },
	{ year: 2018, month: 9, day: 26, week: '水', holiday: '' },
	{ year: 2018, month: 9, day: 27, week: '木', holiday: '' },
	{ year: 2018, month: 9, day: 28, week: '金', holiday: '' },
	{ year: 2018, month: 9, day: 29, week: '土', holiday: '' },
	{ year: 2018, month: 9, day: 30, week: '日', holiday: '' }
];

const schedule_data = {
	date_key: "20180909",
	schedule_type: 2,
	shot_type: 1,
	time_from: "15:00",
	time_to: "20:30",
	event_name: "テストイベント",
	remarks: "テスト備考",
	// cos_chara: [],
	prefectures: [13, 15],
	tags: ["テストタグA", "テストタグB"],
	cost: 0,
	num: 0,
	event_url: "http://test.com",
}

module.exports = {
	getSession(init_data = false){
		const data = session_data;
		if(init_data){
			data.user.id = 999999;
			data.user.user_name = 'テストカメラマン';
			data.user.email = 'cam@cam.com';
			data.user.user_type = 2;
		}
		return data;
	},
	getUser(){
		return user_data;
	},
	getReq(init_data = false){
		const data = req_data;
		if(init_data){
			data.session.user.id = 999999;
			data.session.user.user_name = 'テストカメラマン';
			data.session.user.email = 'cam@cam.com';
			data.session.user.user_type = 2;
		}
		return req_data
	},
	getCalendarDateList(){
		return calendar_date;
	},
	getSchedule(){
		return 
	}
};