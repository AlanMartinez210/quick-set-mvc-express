var abstractRepository = require('./abstractRepository');

const sessionHelper = require("../common/helper/sessionHelper");
const errorHelper = require('../common/helper/errorHelper');

var repo;
module.exports = () =>{
	// リポジトリは2回以上作成しない
	repo = repo || Object.assign(userRepository, abstractRepository("User"))
	return repo;
}

const userRepository = {
	/**
	 * ユーザーIDからユーザーデータを取得する。
	 */
	getUserById: (user_id, options = {}) => {
		return repo.findById(user_id, options);
	},

	/**
	 * user_keyまたは、メールアドレスからユーザーデータを取得する。
	 */
	getUserByUserKeyOrEmail: (key, password, options = {}) => {
		options.where = {
			[repo.Op.or]: [
				{id: key},
				{user_key: key},
				{email: key}
			],
			[repo.Op.and]: [
				{password: password}
			]
		}
		return repo.getUserAll(options);
	},
	
	/**
	 * メールアドレスからユーザーを取得します。
	 */
	getUserByEmail:(email, options = {}) => {
		options.where = {
			email: email
		}
		return repo.getUserAll(options);
	},

	/**
	 * すべてのユーザーを取得する。
	 */
	getUserAll: (options = {}) => {
		return repo.findAll(options)
	},

	/**
	 * 新しくユーザーを作成する。
	 */
	create: (user_data, options = {}) => {
		return repo.create(user_data, options)
		.then(row => {
			return row;
		})
	},

	/**
	 * ユーザーデータのexpiration_dateに削除予定の日付を追加します。
	 */
	deleteUser: (user_id, delete_date , options = {}) => {
		options.where = {
			id: user_id
		}
		values = {
			expiration_date: delete_date
		}
		return repo.update(values, options);
	},

	/**
	 * 対象のユーザーの有効期限を削除します。
	 */
	deleteExpirationDate: (user_id, options = {}) => {
		return repo.updateExpirationDate(user_id, null, options);
	},

	/**
	 * 対象のユーザーの有効期限を更新します。
	 */
	updateExpirationDate: (user_id, expiration_date, options = {}) => {
		options.where = {
			id: user_id
		}
		values = {
			expiration_date: expiration_date
		}
		return repo.update(values, options);
	}
};
