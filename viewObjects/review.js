module.exports = {
  review_page: class{
    constructor({
      unReviewList = {rows:[/* unReviewItem */], pages:{}},
      revieweeHistoryList = {rows:[/* revieweeHistoryItem */], pages:{}},
      reviewHistoryList = {rows:[/* reviewHistoryItem */], pages:{}}
    }){
      this.unReviewList = unReviewList;
      this.revieweeHistoryList = revieweeHistoryList;
      this.reviewHistoryList = reviewHistoryList;
    }
  },

	/**
	 * 未レビュー一覧
	 */
  unReviewItem: class {
    constructor({matching_id = "", review_date = {}, user_name = ""}){
      this.matching_id = matching_id;
      this.review_date = review_date;
      this.user_name = user_name;
    }
  },

  /**
   * あなたへのレビュー一覧
   */
  revieweeHistoryItem: class {
    constructor({review_id = "", reviewee_date = {}, reviewee_user_name = "", review_type = ""}){
      this.review_id = review_id;
      this.reviewee_date = reviewee_date;
      this.reviewee_user_name = reviewee_user_name;
      this.review_type = review_type;
    }
  },

  /**
   * あなたからのレビュー一覧
   */
  reviewHistoryItem: class {
    constructor({review_id = "", review_date = {}, review_user_name = "", review_type = ""}){
      this.review_id = review_id;
      this.review_date = review_date;
      this.review_user_name = review_user_name;
      this.review_type = review_type;
    }
  }

}
