const sequelize = require('../../models/index').sequelize;

const review = require('../../models/review');
const matching = require('../../models/matching');

const errorHelper = require('../../common/helper/errorHelper');


module.exports = {
  postReview,
};

function postReview(req){
  var data = {
    review_from: req.session.user.id,
    matching_id: req.form_data.matching_id,
    review_type: req.form_data.review_type,
    review_comment: req.form_data.review_comment,
  };
  return new Promise((resolve,reject)=>{
    matching().findOne({where:{id:data.matching_id}}).then(row=>{
      if(!row) reject(errorHelper.message({code: "L00004"})); // 依頼が存在しない場合エラー
      else{
        resolve(review().create(data));
      }
    }).catch(reject);
  });
}
