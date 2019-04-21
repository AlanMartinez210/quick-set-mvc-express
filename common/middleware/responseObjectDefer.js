const c2link4DiService = require("../../services/c2link4DiService");

const enumGroup = {
  enumShotType: c2link4DiService.enumShotType(),
  enumNoticeType: c2link4DiService.enumNoticeType(),
  enumMatchingStatus: c2link4DiService.enumMatchingStatus(),
  enumScheduleType: c2link4DiService.enumScheduleType(),
  enumUserType: c2link4DiService.enumUserType(),
  enumPref: c2link4DiService.enumPref(),
  enumEquipmentType: c2link4DiService.enumEquipmentType(),
  enumUseYearType: c2link4DiService.enumUseYearType(),
  enumMakerType: c2link4DiService.enumMakerType(),
  enumDataPassType: c2link4DiService.enumDataPassType(),
  enumContactType: c2link4DiService.enumContactType()
}

module.exports = (req, res, next) =>{
	// resにHTMLレンダー用の雛形を設定する。
	res.render_obj = (function(){

		let self = true;
    let session = req.session;
    let content_id = "";
    let header = {
      menu: { notice: [] },
      data: {},
      publicMode: false
    };
    let body = {
      data: {},
      backBtn: {}
		}

		return {
      get self() {return self},
      get session() {return session},
      //
      get userType(){return session.user ? session.user.user_type : ""},
      get userId(){return session.user ? session.user.id : ""},
      get userName(){return session.user ? session.user.user_name : ""},
      //
      get title() {return header.title},
      set title(t) {header.title = t},
      //
      get publicMode() {return header.publicMode},
      set publicMode(flg) {header.publicMode = flg},
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
      get backBtn() {return body.backBtn},
      set backBtn(btnObj = {}) {
        Object.assign(body.backBtn, btnObj);
      },
      get globalParam() {return enumGroup}
    }
  })();

  // resに返却用のJsonの雛形を定義します。
	res.resJsonData = {
    data: {},
    error:{}
	};

	next();
}
