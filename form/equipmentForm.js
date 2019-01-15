const _ = require("lodash");

/**
 * 所持機材の新規登録
 */
exports.post = {
  equipment_type: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
		isInt: {
			errorMessage: 'fatal',
			options: { min: 1, max: 99 }
		}
	},
	maker_type: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true },
		isInt: {
			errorMessage: 'fatal',
			options: { min: 1, max: 99 }
		}
	},
	maker_name: {
		in: 'body',
		custom: {
			errorMessage: 'E00002',
			options: (value, {req}) => {
				if (Number(req.body.maker_type) !== 99) return true;
				return value ? true : false;
			}
		}
	},
	equipment_name: {
		in: 'body',
		isEmpty: { errorMessage: 'E00002', negated: true }
	},
	use_year: {
		in: 'body',
		isInt: {
			errorMessage: 'fatal',
			options: [[1, 2, 3]]
		}
	}
}