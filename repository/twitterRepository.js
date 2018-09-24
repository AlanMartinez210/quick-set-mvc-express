var abstractRepository = require('./abstractRepository');

var repo;
module.exports = () =>{
	repo = repo || Object.assign(twitterRepository, abstractRepository(AuthTwitter));
	return repo;
}


const twitterRepository = {
};
