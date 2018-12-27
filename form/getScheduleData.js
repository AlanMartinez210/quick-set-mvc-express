/**
 * ユーザー情報取得
 */
module.exports = {
  schedule_id: { 
    in: 'params',
    custom: {
      // TODO
			errorMessage: "E00017",
			options: value =>{
				return value === "every" || value === "today"
			}
		}
  },
}