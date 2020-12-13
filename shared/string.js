/**
 * Utils > String
 */

export const StringUtil = {
	isEmpty(str) {
		return StringUtil.isString(str) && str.length === 0
	},

	isString(str) {
		return typeof str === 'string'
	},

	toKebabCase(str) {
		return str
			? str
					.replace(/\.?([A-Z]+)/g, (x, y) => '-' + y.toLowerCase())
					.replace(/^-/, '')
			: ''
	}
}
