const abstractRepository = require('./abstractRepository');
const model = require('../models/matching');

let repo;
module.exports = () =>{
  // リポジトリは2回以上作成しない
  repo = repo || Object.assign(matchingRepository, abstractRepository(model))
  return repo;
}


const matchingRepository = {
}
