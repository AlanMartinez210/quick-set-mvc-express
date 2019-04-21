const c2link4DiService = require("../services/c2link4DiService");
const _ = require('lodash');

function getCostumeInfoBase(obj){
  return {
    costume_id: obj.get("id"),
    content_title_name: obj.get("content").get("name"),
    content_chara_name: obj.get("chara").get("name"),
    costume_comment: obj.get("remarks")
  }
}

module.exports = {
  
  /**
   * 所持コスプレ衣装一覧
   */
  costume_list: class {
    constructor(model_object_arr){
      if(!_.isArray(model_object_arr)) model_object_arr = [];
      
      this.rows = model_object_arr.map(v => {
        return getCostumeInfoBase(v)
      });
      this.count = this.rows.length;
    }
  },

  /**
   * 所持コスプレ情報
   */
  costume_info: class {
    constructor(model_object){
      this.item = getCostumeInfoBase(model_object);
    }
  }

}
