const db = require("../models/index");
const errorHelper = require('../common/helper/errorHelper');
const _ = require('lodash');

const fs = require('fs');

/**
 * サンプル画像の登録を行います。
 * 
 * @param {string} user_id
 * @param {string} icon_name
 */
exports.registSampleImage = async (user_id, sample_image_name) => {

  const user_data = await db.User.getUserById(user_id);
  
  if(!user_data) return Promise.reject(new errorHelper({ code: "fatal" }));

  const sm = user_data.get("sample_image") ? user_data.get("sample_image") : [];

  // 枚数チェック
  if(sm.length >= 3) return Promise.reject(new errorHelper({ status: 400, code: "E00019" }));

  sm.push(sample_image_name);

  const options = {};
  options.where = { id: user_id };
  const values = { sample_image: sm };
  return db.User.update(values, options);
}


/**
 * サンプル画像の削除を行います。
 * 
 * @param {string} user_id
 * @param {string} icon_name
 */
exports.deleteSampleImage = async (user_id, sample_image_name) => {

  const user_data = await db.User.getUserById(user_id);
  
  if(!user_data) return Promise.reject(new errorHelper({ code: "fatal" }));

  let sm = user_data.get("sample_image") ? user_data.get("sample_image") : [];

  // 対象の名称を配列から消す
  sm = _.remove(sm, n => n !== sample_image_name);

  const options = {};
  options.where = { id: user_id };
  const values = { sample_image: sm };
  await db.User.update(values, options);

  try{
    fs.unlinkSync(`${__dirname}/../public/image/sampleimages/${sample_image_name}`)
  }catch(err){
    console.log('err: ', err);
    return Promise.reject(new errorHelper({ code: "fatal" }));
    
  }

  return await db.User.getUserById(user_id);
}