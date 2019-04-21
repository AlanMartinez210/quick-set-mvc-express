const _ = require('lodash');

function getTitleInfoBase(obj){
  return {
    id: obj.get("id"),
    name: obj.get("name"),
    sub_title: obj.get("sub_title"),
    abbreviation: obj.get("abbreviation"),
  }
}

function getCharaInfoBase(obj){
  return {
    id: obj.get("id"),
    content_title_id: obj.get("content_title_id"),
    name: obj.get("name"),
    nickname: obj.get("nickname"),
    name_type: obj.get("name_type")
  }
}

module.exports = {

  /**
   * 作品情報
   */
  title_info: class {
    constructor(model_object){
      this.item = getTitleInfoBase(model_object);
      this.item.chara_list = {
        rows: model_object.get("content_chara").map(v => {
          return getCharaInfoBase(v);
        }),
        count: model_object.get("content_chara").length
      }
    }
  },

  /**
   * キャラクター情報
   */
  chara_info: class {
    constructor(model_object){
      this.item = getCharaInfoBase(model_object);
      this.item.title_info = getTitleInfoBase(model_object.get("content_title"))
    }
  },
  
  /**
   * 検索結果(タイトル)
   */
  search_results: class {
    constructor(model_object_arr){
      if(!_.isArray(model_object_arr)) model_object_arr = [];

      this.rows = [];
      let title_info = {};
      let chara_info = {};

      model_object_arr.forEach(o => {

        if(o.constructor.name === "Content_title"){
          title_info = getTitleInfoBase(o);
          
          o.get("content_chara").forEach(obj => {
            chara_info = getCharaInfoBase(obj);
            chara_info.title_info = title_info;
            this.rows.push(chara_info);
          })
        }
        else{
          chara_info = getCharaInfoBase(o);
          chara_info.title_info = getTitleInfoBase(o.get("content_title"));
          this.rows.push(chara_info);
        }

      });

      this.count = this.rows.length;
    }
  }
}
