const matchingPattern = require('./matchingPattern');
const reviewPattern = require('./reviewPattern');
const basePattern = require('./basePattern');

(function(){
	const mp = new reviewPattern();
	mp.genReviewData();
})();