export default class sessionMsg{
  constructor(){
  }
  load(myApp){
    // セッションからアクセスモードを取り出し、モードごとの処理を行う。
    switch(window.sessionStorage.getItem(['access_mode'])){
      case "register":
        // 案内用ダイアログを表示する。
        myApp.showInfoDialog({
          name: "registerInfo",
          title: "c2Linkへようこそ！",
          text: "<p>まずは自分のスケジュールを入力して、みんなに広めましょう！</p>",
        }).closelabel("閉じる")
        .addBtn({
          label: "移動する",
          callback: function() {
            location.href = '/mypage/schedule';
          }
        })
        break;
      case "login":
        // ログインしたことを通知する。
        myApp.showInfo("ログインしました。");
        break;
      case "logout":
        // ログアウトしたことを通知する。
        myApp.showInfo("ログアウトしました。");
        break;
      case "proc_comp":
        // 処理が正常に完了したことを通知します。
        myApp.showInfo("処理が正常に完了しました。");
      case "account_dalete":
        // ログアウトしたことを通知する。
        myApp.showInfo("アカウントの削除が完了しました。");
        break;
    }
    window.sessionStorage.removeItem(['access_mode']);

  }
  /**
   * access_modeにキーを設定します。
   * 
   * @param {*} key 
   */
  setAccessMode(key){
    window.sessionStorage.setItem(['access_mode'],[key]);
  }
}