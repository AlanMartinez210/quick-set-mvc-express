/** 募集のブックマークフォーム */
exports.getRecruitDetail = {
	schedule_id: {
		in: 'params',
		isEmpty: { errorMessage: 'fatal', negated: true },
	}
}