import { Platform } from 'react-native'
import { config } from '../config'
import { RequestService } from './request'
import RNFetchBlob from 'rn-fetch-blob'

const DOWNLOAD_TIMEOUT = 10000

export class FSService {
	_getRequestServiceInstance() {
		if (!this._requestService) this._requestService = new RequestService()

		return this._requestService
	}

	getOSSpecificFileUri(file) {
		return (Platform.OS === 'android' ? 'file://' : '') + file
	}

	parseOSSpecificFilePath(file) {
		return Platform.OS === 'android' ? file.replace(/^file:\/\//, '') : file
	}

	getDocumentDirectoryPath() {
		const dirs = RNFetchBlob.fs.dirs
		return `${dirs.DocumentDir}/${config.appDomain}`
	}

	getDownloadTimeout() {
		return DOWNLOAD_TIMEOUT
	}

	download(endpoint, data, options) {
		return this._getRequestServiceInstance()
			.getHeaders(this._getRequestServiceInstance().GET, endpoint)
			.then(headers => {
				return RNFetchBlob.config({
					path: this.parseOSSpecificFilePath(options.toFile)
				}).fetch(
					'GET',
					`${config.apiBaseUrl}${endpoint}${
						data
							? this._getRequestServiceInstance().preProcessQueryStringData(
									data
							  )
							: ''
					}`,
					headers
				)
			})
	}

	mkdir(path) {
		return RNFetchBlob.fs.mkdir(path)
	}

	stopDownload(downloadHandler) {
		if (downloadHandler && downloadHandler.cancel) downloadHandler.cancel()
	}

	exists(filePath) {
		return RNFetchBlob.fs.exists(filePath)
	}

	getFileStat(filePath) {
		return RNFetchBlob.fs.stat(filePath)
	}

	getFileModifiedTime(filePath) {
		return this.getFileStat(filePath)
			.then(({ lastModified, size }) => {
				console.debug('size', size)

				return size ? new Date(lastModified.valueOf()) : 0
			})
			.catch(_e => 0)
	}

	getHashChecksum(filePath) {
		return this.exists(filePath).then(exists => {
			console.debug('hashing', filePath, 'exists', exists)
			return RNFetchBlob.fs.hash(filePath, 'md5').catch(_e => {
				console.debug('hash sum error:', _e)
				return ''
			})
		})
	}
}
