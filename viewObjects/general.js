/**
 * 特定のページに属さない、汎用的なviewObjectを定義します。
 */
module.exports = {

  /**
   * ユーザー情報
   */
  userInfo: class {
    constructor(user_info = {}){
      this.user_key = user_info.get("user_key");
      this.user_name = user_info.get("user_name");
      this.email = user_info.get("email");
      this.icon_url = user_info.get("icon_url");
      this.bg_image_url = user_info.get("bg_image_url");
      this.prefectures = user_info.get("prefectures");
      this.tags = user_info.get("tags");
    }
  }

}