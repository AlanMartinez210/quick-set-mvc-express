

module.exports = {
	req:{
		session: {
			cookie:
				{ path: '/',
				 _expires: '2019-07-19T08:52:48.854Z',
				 originalMaxAge: 31536000000,
				 httpOnly: true },
			 user:
				{ id: 999999,
					userid: '9707eaafa609',
					username: 'テストカメラマン',
					password: 'pass',
					email: 'cam@cam.com',
					icon_url: null,
					user_type: 2,
					created_at: '2018-07-19T02:33:00.000Z',
					updated_at: '2018-07-19T02:33:00.000Z'
				} 
		},
		params:{},
		body:{},
		query:{}
	},
	res:{
		render: function(path, param){
			console.log("test path: " + path);
			console.log("test send param : **************");
			console.log("");
			// console.log("**** session -> ");
			// console.debug(param.session);
			console.log("**** title -> ");
			console.log(param.title);
			console.log("**** contentId -> ");
			console.log(param.contentId);
			console.log("**** menuNotice -> ");
			console.log(param.menuNotice);
			console.log("**** headerData -> ");
			console.log(param.headerData);
			console.log("**** bodyData -> ");
			console.log(param.bodyData);
			console.log("");
			console.log("************** : test send param");
			
			return;
		},
		json: function(json_data){
			console.log("test send json data : **************");
			console.log("");

			console.log("**** bodyData -> ")
			console.debug(json_data);
			console.log("");
			console.log("************** : test send data")
		},
		status: [
			function(status){
				
			},
			{json: this.json}
		]
	},
	next: function(err){
		if(err) console.error(err); 
		return; 
	}
}