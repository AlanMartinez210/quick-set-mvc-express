const tagRepository = require('../repository/tagRepository');
const user = require('../models/user');
const prefectureHelper = require('../common/helper/prefectureHelper');

module.exports = {
  /**
   * プロフィール編集画面の初期表示データを取得します。
   */
  getProfileEditViewData: async (user_id)=>{
    let userData = await user().findOne({where:{id:user_id},attributes:['user_name','email','icon_url','tags','prefectures']});
    let tags = userData.tags;
    let prefectures = userData.prefectures;
    
    // 配列tagsからタグ名を取得
    let tagData = await tagRepository().getTagRowById(tags).catch(err=>{
      new Error("エラーが発生しました");
    })
    let tagArray = new Array();
    for(let tag of tagData){
      tagArray.push(tag.tag_name);
    }
    
    //配列prefecturesから都道府県名を取得
    let prefectureArray = prefectureHelper.getPrefectureNameByIds(prefectures);    

    let data = {
      icon_url: userData.icon_url,
      user_name: userData.user_name,
      email: userData.email,
      tags: tagArray,
      prefectures: prefectureArray,
    }
    return data;
  },
}
