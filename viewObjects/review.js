module.exports = {
	/**
	 * 未レビュー一覧
	 */
  unReviewList: class {
    constructor({review_id = "", review_date = {}, user_name = ""}){
      this.review_id = review_id;
      this.review_date = review_date;
      this.user_name = user_name;
    }
  },

  /**
   * あなたへのレビュー一覧
   */
  revieweeHistoryList: class {
    constructor({review_id = "", reviewee_date = {}, reviewee_user_name = "", review_type = ""}){
      this.review_id = review_id;
      this.reviewee_date = reviewee_date;
      this.user_name = user_name;
      this.review_type = review_type;
    }
  },

  /**
   * レビュー履歴一覧
   */
  revieweeHistoryList: class {
    constructor({review_id = "", review_date = {}, review_user_name = "", review_type = ""}){
      this.review_id = review_id;
      this.review_date = review_date;
      this.review_user_name = review_user_name;
      this.review_type = review_type;
    }
  }

}