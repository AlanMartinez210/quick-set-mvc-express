const abstractRepository = require('./abstractRepository');

var repo;
module.exports = () =>{
  // リポジトリは2回以上作成しない
  repo = repo || Object.assign(recruitBookmarkRepository, abstractRepository("recruit_bookmarks"));
  return repo;
}


const recruitBookmarkRepository = {
  /**
   * 募集ブックマークの登録を行います。
   */
  createBookmark: (user_id, schedule_id) => {
    return repo.create({user_id, schedule_id}, {ignoreDuplicates: true});
  },

  /**
   * 募集ブックマークの削除を行います。
   */
  deleteBookmark: (user_id, schedule_id) => {
    return repo.destroy({where:{user_id, schedule_id}}, {});
  },
}
