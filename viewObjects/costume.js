const c2link4DiService = require("../services/c2link4DiService");
const _ = require('lodash');

class charaInfo{
  constructor(content_chara){
    this.id = content_chara.get("id");
    this.name = content_chara.get("name");
  }
}

module.exports = {

  content_title_obj: class {
    constructor(contentTitleList = []){
      this.rows = contentTitleList.map(contentTitle=>{
        return {
          id: contentTitle.get("id"),
          name: contentTitle.get("name"),
          chara_list: contentTitle.get("content_chara").map(v=>new charaInfo(v)),
        };
      });
      this.count = contentTitleList.length;
    }
  },

  costume_list: class {
    constructor(costumeList){
      this.rows = costumeList.map(v=>{
        return {
          costume_id: v.get("id"),
          title: v.get("content").get("name"),
          chara: v.get("chara").get("name"),
        }
      });
    }
  },

  return_title_info: class {
    constructor(content_title){
      this.title_info = {
        id: content_title.get("id"),
        name: content_title.get("name"),
        chara_list: content_title.get("content_chara").map(v=>new charaInfo(v)),
      };
    }
  },

  return_chara_info: charaInfo,

  costume_obj: class {
    constructor(User_content_relation){
      this.costume_info = {
        costume_id: User_content_relation.get("id"),
        content_title_name: User_content_relation.get("content").get("name"),
        conf_content_title: User_content_relation.get("content").get("id"),
        content_chara_name: User_content_relation.get("chara").get("name"),
        conf_content_chara: User_content_relation.get("chara").get("id"),
        costume_comment: User_content_relation.get("remarks"),
      }
    }
  }

}
