/**
 * Utils > Number
 */

export const NumberUtil = {
	isNumber(num) {
		return typeof num === 'number'
	},

	toCurrency(value, currency) {
		let integerPart
		let decimals
		const settings = {
			precision: 2
		}

		if (value === '') return ''

		value = parseFloat(value).toFixed(settings.precision)
		integerPart = value.toString().split('.')[0]
		decimals = value.toString().split('.')[1]

		switch (currency) {
			case 'BRL':
				if (isNaN(integerPart) || integerPart < 1) integerPart = '0'

				integerPart = integerPart
					.toString()
					.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
				value = integerPart + ',' + decimals
				break

			case 'MXN':
			case 'USD':
			default:
				integerPart = integerPart
					.toString()
					.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
				value = integerPart + '.' + decimals
				break
		}

		return value
	}
}
