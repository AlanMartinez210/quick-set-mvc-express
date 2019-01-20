const c2link4DiService = require("../services/c2link4DiService");
const _ = require('lodash');

module.exports = {
  
  content_title_obj: class {
    constructor(contentTitlelist = []){
      this.rows = [
        {id: 1, name: "タイトルA", chara_list: [
          {id: 1, name: "キャラA"},
          {id: 2, name: "キャラB"},
          {id: 3, name: "キャラC"},
        ]},
				{id: 2, name: "タイトルB", chara_list: [
          {id: 1, name: "キャラA"},
          {id: 2, name: "キャラB"},
          {id: 3, name: "キャラC"},
        ]},
        {id: 3, name: "タイトルC", chara_list: [
          {id: 1, name: "キャラA"},
          {id: 2, name: "キャラB"},
          {id: 3, name: "キャラC"},
        ]},
      ]
      this.count = 3
    }
  },

  costume_list: class {
    constructor(){
      this.rows = [
        {costume_id: 1, title: "タイトルA", chara: "キャラA"},
        {costume_id: 2, title: "タイトルA", chara: "キャラB"},
        {costume_id: 3, title: "タイトルA", chara: "キャラC"},
      ]
    }
  },

  return_title_info: class {
    constructor(){
      this.title_info = {id: 1, name: "タイトルD", chara_list: []}
    }
  },

  return_chara_info: class {
    constructor(){
      this.chara_info = {id: 4, name: "キャラD"}
    }
  },

  costume_obj: class {
    constructor(){
      this.costume_info = {
        costume_id: 1, 
        content_title_name: "タイトルA",
        conf_content_title: 1,
        content_chara_name: "キャラA",
        conf_content_chara: 1,
        costume_comment: "ちょっとオリジナル入ってます。"
      }
    }
  }

}