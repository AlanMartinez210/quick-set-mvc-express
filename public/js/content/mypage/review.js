import plugin_pager from "../../plugin/pager";

export default class review{
	constructor(){
    this.$unReviewSection = $("#unReviewSection");
    this.$revieweeHistorySection = $("#revieweeHistorySection");
    this.$reviewHistorySection = $("#reviewHistorySection");
    this.editReviewBtn = "[name=editReviewBtn]";
    this.$reviewMsg = $("#reviewMsg");
    this.doPostReviewBtn = $("[name=doPostReview]")
    this.$reviewForm = $("[name=reviewForm]");
  }
	ready(){
    this.pager = new plugin_pager(this.app);
    
    // レビュー編集モーダルを開く
    this.$unReviewSection.on("click", this.editReviewBtn, {
      type: "editReview",
      onOpenBrefore: (e) => {
        // 初期化 & 登録ボタンを表示
        this.initModal();
        $(`[data-proc=create]`).show();

        const $t = $(e.currentTarget);
        this.$reviewMsg.text(`${$t.data("user")} へレビューをします。`);
        $("[name=select_id]").val($t.data("matching_id"));
        

        // レビュー内容の取得
      }
    }, e => this.app.showModal(e));

    // あなたへのレビューモーダルを開く
    this.$revieweeHistorySection.on("click", this.editReviewBtn, {
      type: "editReview",
      onSyncOpenBrefore: (resolve, reject, e) => {
        // 初期化 & 処理ボードを非表示
        this.initModal();
        $(".proc-board").hide();
        $("[name=review_comment]").prop("readonly", true);

        const $t = $(e.currentTarget);
        this.$reviewMsg.text(`${$t.data("user")} からのレビューです。`);
        $("[name=select_id]").val($t.data("review_id"));

        resolve();
      }
    }, e => this.app.showModal(e));

    // レビュー履歴モーダルを開く
    this.$reviewHistorySection.on("click", this.editReviewBtn, {
      type: "editReview",
      onSyncOpenBrefore: (resolve, reject, e) => {
        // 初期化 & 編集ボタンを表示
        this.initModal();
        $(`[data-proc=edit]`).show();

        const $t = $(e.currentTarget);
        this.$reviewMsg.text(`${$t.data("user")} へレビューを編集します。`);
        $("[name=select_id]").val($t.data("review_id"));

        resolve();
      }
    }, e => this.app.showModal(e));

    // 登録/編集ボタンの処理
    this.doPostReviewBtn.on("click", e => {
      const $t = $(e.currentTarget);
      const proc = $t.data("proc");
      let dialog = {};
      const sendData = this.$reviewForm.getValue();
      console.log('sendData: ', sendData);

      switch(proc){
        case "create":
          dialog = this.app.showWarnDialog({
            name: "checkCreate",
            title: "登録の確認",
            text: "レビューを登録します。よろしいですか？"
          })
          break;
        case "edit":
          dialog = this.app.showWarnDialog({
            name: "checkEdit",
            title: "編集の確認",
            text: "レビューを編集します。よろしいですか？"
          })
          break;
      }

      dialog
      .closelabel("いいえ")
			.addBtn({
				callback: () => {
					this.app.sendPost("/mypage/review", sendData)
					.done(result => {
						this.app.hideDialog();
						this.app.showClearAll();
						this.app.showInfo("処理に成功しました。");
					})
				}
			})


      return false;
    });

    this.pager.ready(["revieweeHistorySection", "reviewHistorySection"]);
  }
  
  // モーダル初期化
  initModal(){
    $(".proc-board").show();
    $(".proc-btn").hide();
    $("[name=review_comment]").prop("readonly", false);
  }

}