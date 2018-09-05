

module.exports = (req, res, next) =>{

	// resにHTMLレンダー用の雛形を設定する。
	res.render_obj = (function(){

		let self = true;
    let session = req.session;
    let content_id = "";
    let header = {
      menu: { notice: [] },
      data: {}
    };
    let body = {
      data: {},
		}

		return {
      get self() {return self},
      get session() {return session},
      //
      get userType(){return session.user ? session.user.user_type : ""},
      get userId(){return session.user ? session.user.userid : ""},
      get userName(){return session.user ? session.user.user_name : ""},
      //
      get title() {return header.title},
      set title(t) {header.title = t},
      //
      get contentId() {return content_id},
      set contentId(cid) {content_id = cid},
      //
      get menuNotice() {return header.menu.notice},
      set menuNotice(menuIdArr = []){
				Array.prototype.push.apply(header.menu.notice, menuIdArr);
      },
      get headerData() {return header.data},
      set headerData(data = {}) {
        Object.assign(header.data, data);
      },
      //
      get bodyData() {return body.data},
      set bodyData(data = {}) {
        Object.assign(body.data, data);
      },
    }
	})();

  // resに返却用のJsonの雛形を定義します。
	res.resJsonData = {
    data: {},
    error:{}
	};

	next();
}
