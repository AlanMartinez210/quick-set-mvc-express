export default class review{
	constructor(){}
	ready(){ 
    const $unReviewSection = $("#unReviewSection");
    const $historySection = $("#revieweeHistorySection, #reviewHistorySection");
    const editReviewBtn = "[name=editReviewBtn]";

    // レビュー編集モーダルを開く
    $unReviewSection.on("click", editReviewBtn, {
      type: "editReview",
      onOpenBrefore: (e) => {
        const $t = $(e.currentTarget);
        console.log($t.data("matching_id"));
      }
    }, e => this.app.showModal(e));

    // あなたへのレビュー / レビュー履歴 モーダルを開く
    $historySection.on("click", editReviewBtn, {
      type: "editReview",
      onSyncOpenBrefore: (resolve, reject, e) => {
        const $t = $(e.currentTarget);
        console.log($t);
        resolve();
      }
    }, e => this.app.showModal(e));
	}

}