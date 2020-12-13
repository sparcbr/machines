import { URL } from 'react-native-url-polyfill'

export const UrlService = {
	combine(url, data) {
		return (
			url +
			(url.match(/\?/) ? '&' : '?') +
			Object.keys(data)
				.map(key => {
					return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
				})
				.join('&')
		)
	},

	parse(input) {
		try {
			const url = new URL(input)
			return {
				protocol: url.protocol,
				host: url.host,
				pathname: url.pathname,
				searchParams: Object.fromEntries(url.searchParams)
			}
		} catch (e) {
			console.debug('Error in url:', input, e)
			return null
		}
	}
}
