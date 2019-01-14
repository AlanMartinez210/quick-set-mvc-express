module.exports = {
	/**
	 * メッセージ一覧
	 */
  messageList: class {
    constructor(chats){
      if(!Array.isArray(chats)){
        this.messages = [];
      }else{
        this.messages = chats.map(chat=>{
          return {
            user_id: chat.user.get('id'),
            message: chat.get('message'),
            date_info: chat.get('createdAt').getDateInfo(),
          };
        });
      }
    }
  },
}
