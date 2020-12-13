import { config } from '../config'
import { StorageService, StorageKeys } from './storage'
import { NetService } from './net'

export class RequestService {
	GET = 'GET'
	POST = 'POST'

	_getNetServiceInstance() {
		if (!this._netService) this._netService = new NetService()

		return this._netService
	}

	getBearerAuthHeader() {
		return StorageService.getItem(StorageKeys.AUTH_DATA).then(authData => {
			return authData && authData.jwt
				? { Authorization: `Bearer ${authData.jwt}` }
				: null
		})
	}

	async getHeaders(method, endpoint) {
		let headers = { ...config.defaultHeaders }

		if (!config.nonAuthenticatedEndpoints[method].includes(endpoint)) {
			const bearerHeader = await this.getBearerAuthHeader()

			headers = { ...headers, ...bearerHeader }
		}

		return headers
	}

	async _setHeaders(method, endpoint, xhr, headers) {
		const systemHeaders = await this.getHeaders(method, endpoint)
		headers = headers ? { ...systemHeaders, ...headers } : { ...systemHeaders }

		for (const headerItem of Object.entries(headers)) {
			xhr.setRequestHeader(headerItem[0], headerItem[1])
		}

		return xhr
	}

	preProcessQueryStringData(data) {
		const s = []

		Object.entries(data).forEach(v => {
			s[s.length] = `${encodeURIComponent(v[0])}=${encodeURIComponent(
				v[1] === undefined || v[1] === null ? '' : v[1]
			)}`
		})
		return '?' + s.join('&').replace(/%20/g, '+')
	}

	get(endpoint, data, headers = null, async = true) {
		return this.safeRequest(
			() =>
				new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest()
					xhr.open(
						this.GET,
						`${config.apiBaseUrl}${endpoint}${
							data ? this.preProcessQueryStringData(data) : ''
						}`,
						async
					)
					xhr.onload = () => {
						this._handleXHRResponse(xhr, resolve, reject)
					}
					this._setHeaders(this.GET, endpoint, xhr, headers).then(xhr => {
						xhr.send()
					})
				})
		)
	}

	_handleXHRResponse(xhr, resolve, reject) {
		const { status, readyState, response } = xhr

		try {
			if (
				((status >= 200 && status < 300) || (status >= 400 && status < 500)) &&
				readyState === 4
			) {
				resolve({
					status: status,
					response: JSON.parse(response ? response : '{}')
				})
			} else {
				reject({
					status: status
				})
			}
		} catch (error) {
			reject({
				error: error
			})
		}
	}

	post(endpoint, data, headers = null, async = true) {
		return this.safeRequest(
			() =>
				new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest()
					xhr.open(this.POST, `${config.apiBaseUrl}${endpoint}`, async)
					xhr.onload = () => {
						this._handleXHRResponse(xhr, resolve, reject)
					}
					this._setHeaders(this.POST, endpoint, xhr, headers).then(xhr => {
						xhr.send(JSON.stringify(data))
					})
				})
		)
	}

	safeRequest(request) {
		return this._getNetServiceInstance()
			.checkConnectivity()
			.then(request)
			.catch(error => {
				throw error
			})
	}
}
