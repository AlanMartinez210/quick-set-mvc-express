const abstractRepository = require('./abstractRepository');

let repo;
module.exports = () =>{
  // リポジトリは2回以上作成しない
  repo = repo || Object.assign(matchingRepository, abstractRepository("Matching"))
  return repo;
}


const matchingRepository = {
}
