const userRepository = require('../repository/userRepository')();
const tagRepository = require('../repository/tagRepository')();
const dateHelper = require('../common/helper/dateHelper');
const hashHelper = require("../common/helper/hashHelper");
const errorHelper = require('../common/helper/errorHelper');
const prefectureHelper = require('../common/helper/prefectureHelper');

/**
 * ユーザーを新規作成します。
 *
 * @param {Object} user_data
 */
exports.createUser = (user_data) => {
  user_data.password = hashHelper(user_data.password);
  return userRepository.getUserByEmail(user_data.email)
    .then(res => {
      // メールアドレスからユーザーが取得できたらエラー
      if (res.length > 0) return Promise.reject(new errorHelper({
        http_status: 400
      }).addErrorData({
        view_id: "email",
        code: "E00010"
      }));
      return userRepository.create(user_data);
    })
    .then(res => {
      return res;
    });
};

/**
 * ログインキー(user_key or email)とパスワードでログイン対象のユーザーを取得を行います。
 */
exports.getloginUserData = (login_key, password) => {
  password = hashHelper(password);
  // ログインキーがユーザーキーと仮定してユーザーデータを取得する。
  return userRepository.getUserByUserKeyOrEmail(login_key, password)
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
    const expiration = dateHelper.getDate(expiration_date);
    if (expiration.isSameOrAfter(today)) {
      resolve(true);
    } else {
      reject(new errorHelper().setWindowMsg("E00009"));
    }
  })
}

/**
 * 対象のユーザーの有効期限をクリアし、更新したユーザーデータを返します。
 */
exports.clearExpirationDate = (user_id) => {
  return userRepository.deleteExpirationDate(user_id)
    .then(res => {
      if (res) {
        return userRepository.getUserById(user_id);
      } else {
        return Promise.reject(new errorHelper().setWindowMsg("E00000"));
      }
    })
}

/**
 * 対象のユーザーに有効期限を設定します。
 */
exports.setExpirationDate = (user_id) => {
  const expiration_date = dateHelper.getDate().add(7, 'days').toDate();
  return userRepository.updateExpirationDate(user_id, expiration_date)
    .then(res => {
      if (res) {
        return userRepository.getUserById(user_id);
      } else {
        return Promise.reject(new errorHelper().setWindowMsg("E00000"));
      }
    })
}

/**
 * プロフィール編集画面の初期表示データを取得します。
 * @param user_id ユーザーID
 * @returns プロフィール編集画面表示データ
 */
exports.getProfileEditViewData = async (user_id) => {
  const userData = await userRepository.getUserById(user_id, {
    attributes: ['user_name', 'icon_url', 'email', 'tags', 'prefectures']
  });
  // ユーザーが存在しない場合はエラー
  if (!userData) {
    throw new errorHelper().setWindowMsg('E00000');
  }
  const tags = userData.tags;
  const prefectures = userData.prefectures;

  // 配列tagsからタグ名を取得
  const tagArray = await tagRepository.getTagById(tags).map(tag => tag.tag_name);

  //配列prefecturesから都道府県名を取得
  const prefectureArray = prefectureHelper.getPrefectureNameByIds(prefectures);

  // usersテーブルから取得したアイコンURL、ユーザー名、メールアドレスが
  // NULLの場合は空文字に置き換えてreturn
  return {
    icon_url: userData.icon_url == null ? '' : userData.icon_url,
    user_name: userData.user_name == null ? '' : userData.user_name,
    email: userData.email == null ? '' : userData.email,
    tags: tagArray,
    prefectures: prefectureArray,
  }
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
  try {
    return userRepository.Sequelize.transaction(
      async (tx) => {
        // タグの登録/更新
        const tagsResult = await function () {
          if (profileData.tags.length <= 0) return;
          const upsertPromise = [];
          profileData.tags.forEach(val => {
            upsertPromise.push(tagRepository.upsertTag(val, {
              transaction: tx
            }));
          })
          return Promise.all(upsertPromise);
        }();
        // ユーザーのタグ部分を登録したタグIDに置き換える
        await function(){
          if(!tagsResult) return;
          const tag_id_arr = [];
          tagsResult.forEach(obj => {
            tag_id_arr.push(obj.tag_id);
          });
          profileData.tags = tag_id_arr;
        }();
        // 活動地域の更新
        profileData.prefectures = prefectureHelper.getPrefectureIdByName(profileData.prefectures);

        // プロフィールの更新(users)
        userRepository.update({
          user_name: profileData.user_name,
          email: profileData.email,
          tags: profileData.tags,
          prefectures: profileData.prefectures
        }, {
          where: {
            id: profileData.id
          }
        });
      }
    )
  } catch (err) {
    return err;
  }
}