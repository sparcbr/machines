import axios from 'axios'
import { StorageUtil, StorageKeys } from './'
import config from '../config.json'

export const RequestUtil = {
	GET: 'GET',
	POST: 'POST',

	async getBearerAuthHeader() {
		return StorageUtil.getItem(StorageKeys.AUTH_DATA).then(authData => ({
			Authorization: `Bearer ${authData.jwt}`
		}))
	},

	async getHeaders(method, endpoint, includeDefaultHeaders = true) {
		let headers = includeDefaultHeaders ? { ...config.defaultHeaders } : {}

		if (!config.nonAuthenticatedEndpoints[method].includes(endpoint)) {
			const bearerHeader = await this.getBearerAuthHeader()

			headers = { ...headers, ...bearerHeader }
		}

		return headers
	},

	preProcessQueryStringData(data) {
		const s = []

		Object.entries(data).forEach(v => {
			s[s.length] = `${encodeURIComponent(v[0])}=${encodeURIComponent(
				v[1] === undefined || v[1] === null ? '' : v[1]
			)}`
		})
		return '?' + s.join('&').replace(/%20/g, '+')
	},

	_validateStatus(status) {
		return status < 500 // Reject only if the status code is greater than or equal to 500
	},

	async get(endpoint, data, settings = {}) {
		const headers = await this.getHeaders(this.GET, endpoint)

		if (!data) data = {}

		data = {
			...data,
			manager: true
		}

		try {
			return axios.get(
				`${config.apiBaseUrl}${endpoint}${
					data ? this.preProcessQueryStringData(data) : ''
				}`,
				{
					headers: headers,
					validateStatus: this._validateStatus,
					...settings
				}
			)
		} catch (e) {}

		return false
	},

	async post(endpoint, data, settings) {
		const headers = await this.getHeaders(this.POST, endpoint)

		endpoint += `${endpoint.match(/\?/) ? '&' : '?'}manager=true`

		try {
			return axios.post(`${config.apiBaseUrl}${endpoint}`, data, {
				headers: headers,
				validateStatus: this._validateStatus,
				...settings
			})
		} catch (e) {}

		return false
	}
}
