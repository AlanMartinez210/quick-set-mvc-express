const c2link4DiService = require("../services/c2link4DiService");
const _ = require('lodash');

module.exports = {
  
  content_title_obj: class {
    constructor(){
      this.rows = [
        {id: 1, name: "ひなまつり"},
				{id: 2, name: "ドールズフロントライン"},
				{id: 3, name: "グランブルーファンタジー"},
				{id: 4, name: "うちのメイドがウザすぎる"},
      ]
      this.count = 4
    }
  },

  content_chara_obj: class {
    constructor(){
      this.rows = [
        {id: 1, name: "ひなまつり"},
				{id: 2, name: "ドールズフロントライン"},
				{id: 3, name: "グランブルーファンタジー"},
				{id: 4, name: "うちのメイドがウザすぎる"},
      ]
    }
  }

}