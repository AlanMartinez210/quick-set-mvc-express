var abstractRepository = require('./abstractRepository');

const authtwitter = require('../models/authtwitter');

var repo;
module.exports = () =>{
	repo = repo || Object.assign(twitterRepository, abstractRepository(authtwitter));
	return repo;
}


const twitterRepository = {
};
