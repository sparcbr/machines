/**
 * Utils > Date
 */

const _DAY = 3600 * 24 * 1000
const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/

export const DateUtil = {
	JSONDateParser(key, value) {
		if (typeof value === 'string') {
			var a = reISO.exec(value)
			if (a)
				return new Date(value)
			a = reMsAjax.exec(value)
			if (a) {
				var b = a[1].split(/[-+,.]/)
				return new Date(b[0] ? +b[0] : 0 - +b[1])
			}
		}
		return value
	},
	formatDate(d) {
		if (!DateUtil.isValidDate(d)) return ''
		return ("0" + d.getDate()).slice(-2) + '/' +
			("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear()
	},
	isValidStringDate(s) {
		var separators = ['\\.', '\\-', '\\/'];
		var bits = s.split(new RegExp(separators.join('|'), 'g'));
		var d = new Date(bits[2], bits[1] - 1, bits[0]);
		return d.getFullYear() == bits[2] && d.getMonth() + 1 == bits[1];
	},
	isValidDate(d) {
		return Object.prototype.toString.call(d) === '[object Date]' && !isNaN(d)
	},
	getMonthName(d) {
		const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
			"Jul", "Ago", "Set", "Out", "Nov", "Dez"
		];

		return monthNames[d.getMonth()]
	},
	createMonthRange(beginDate, endDate) {
		let range = []
		let d = new Date(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate()), end
		let n = endDate.getMonth() - beginDate.getMonth()
		if (n < 0) n += 12
		for (let i = 0; i < n; i++) {
			end = new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0)
			range.push({
				begin: new Date(d),
				end: end,
				label: DateUtil.getMonthName(d)
			})
			//console.debug('range internal=', range)
			d.setMonth(d.getMonth() + 1)
			d.setDate(1)
		}
		range.push({
			begin: d,
			end: endDate,
			label: DateUtil.getMonthName(d)

		})
		//console.debug('range internal=', range)
		return range
	},
	monthsFromNow(months) {
		let d = new Date()
		d.setMonth(d.getMonth() - months)
		return d
	},
	diffInDays(d1, d2) {
		return (d1 - d2) / _DAY
	}
}
