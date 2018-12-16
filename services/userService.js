const db = require("../models/index");

const dateHelper = require('../common/helper/dateHelper');
const errorHelper = require('../common/helper/errorHelper');

/**
 * ユーザーの作成を行います。
 * 同一のメールアドレスを持っている場合にはエラーを返します。
 *
 * @param {Object} user_data
 */
exports.createUser = (new_user_data) => {
  return db.User.getUserByEmail(new_user_data.email, {
      row: true
    })
    .then(instances => {
      if (instances.length > 0) {
        return Promise.reject(new errorHelper({
          http_status: 400
        }).addErrorData({
          view_id: "email",
          code: "E00010"
        }));
      }
      return db.User.createUser(new_user_data)
    })
};

/**
 * ログインキー(user_key or email)とパスワードでログイン対象のユーザーを取得を行います。
 */
exports.getloginUserData = (login_key, password) => {
  // ログインキーがユーザーキーと仮定してユーザーデータを取得する。
  return db.User.getUserByUserKeyOrEmail(login_key, password)
    .then(res => {
      const login_user_data = res[0];
      // ユーザーが存在しない場合はエラーを返す。
      if (!login_user_data) return Promise.reject(new errorHelper().setWindowMsg("E00001"));
      return login_user_data;
    });
}

/**
 * 対象のユーザーの有効期限が切れていないかチェックします。
 */
exports.checkExpirationDate = (expiration_date) => {
  return new Promise((resolve, reject) => {
    const today = dateHelper.getDate();
    if (expiration_date.isSameOrAfter(today)) {
      resolve();
    } else {
      reject(new errorHelper().setWindowMsg("E00009"));
    }
  })
}

/**
 * 対象のユーザーの有効期限をクリアし、更新したユーザーデータを返します。
 */
exports.clearExpirationDate = (user_id) => {
  return db.User.deleteExpirationDate(user_id)
    .then(() => {
      return db.User.getUserById(user_id)
    })
}

/**
 * 対象のユーザー情報を取得します。
 * 
 * @param {string} user_id
 */
exports.getUserData = async (user_id) => {
  const user_data = await db.User.getUserByKey(user_id);
  if (!user_data) return Promise.reject(new errorHelper().setWindowMsg("E00001"));

  // タグデータ取得
  if (user_data.get("tags")) {
    const tags = await db.Tag.getTagById(user_data.get("tags"));
    if (tags) user_data.set("tags", tags.map(v => v.toJSON()));
  }
  return user_data;

}

/**
 * プロフィール編集画面から入力された情報を登録します。
 * @param profileData プロフィールデータ
 * id: ユーザID
 * user_name: ユーザー名
 * email: メールアドレス
 * tags: タグ
 * prefectures: 活動地域
 */
exports.updateProfileData = async (profileData) => {
  return db.sequelize.transaction(async function (tx) {
    // タグの登録/更新
    const tagsResult = await
    function () {
      if (profileData.tag_field.length <= 0) return;
      const upsertPromise = [];
      profileData.tag_field.forEach(val => {
        upsertPromise.push(db.Tag.upsertTag(val, {
          transaction: tx
        }));
      })
      return Promise.all(upsertPromise);
    }();

    // タグID取得
    await
    function () {
      if (!tagsResult) return;
      const tag_id_arr = [];
      tagsResult.forEach(obj => {
        tag_id_arr.push(obj.tag_id);
      });
      profileData.tag_field = tag_id_arr;
    }();

    // 都道府県IDを文字列から数値に変換
    const prefecture_id_arr = [];
    profileData.prefectures_field.forEach(prefecture_id => {
      prefecture_id_arr.push(Number(prefecture_id));
    });
    profileData.prefectures_field = prefecture_id_arr;

    // プロフィール情報の更新
    const profileResult = await
    function () {
      options = {
        where: {
          user_key: profileData.user_id
        },
        transaction: tx
      };
      const values = {
        user_name: profileData.user_name,
        email: profileData.email,
        tags: profileData.tag_field,
        prefectures: profileData.prefectures_field
      };
      return db.User.update(values, options);
    }();
  });
}
/**
 * サイト設定画面に必要な情報を取得します。
 * @param user_id ユーザーID
 * @returns サイト設定画面表示データ
 */
exports.getSiteSettingData = async (user_id) => {
  const userData = await db.User.getUserById(user_id, {
    attributes: ['allow_bookmark_notification']
  });
  // ユーザーが存在しない場合はエラー
  if (!userData) {
    throw new errorHelper().setWindowMsg('E00000');
  }
  return {
    allow_bookmark_notification: userData.allow_bookmark_notification == null ? 0 : userData.allow_bookmark_notification
  }
}