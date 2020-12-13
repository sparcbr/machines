import AsyncStorage from '@react-native-community/async-storage'

const REMOTE_POLLING_INTERVAL_EXTRA_TIME = 5000

// AsyncStorage.clear()
export const StorageKeys = {
	HIGHLIGHT_INFO: 'highlightInfo', // highlighted review's data
	INFO: 'info', // individual review data
	INFO_ALL: 'infoAll',
	COVER_INFO: 'coverInfo', // time, hash?
	USER_COLLECTIONS: 'userCollections', // collections: favorites, watching, etc (ids)
	HOME_LIST: 'homeList', // home screen review list data
	DOWNLOAD_MAP: 'downloadMap', // review's audio and text content
	VERSION: 'version', // review version number
	AUTH_DATA: 'authData',
	UUID: 'uuid', // the remote generated uuid
	SETTINGS: 'settings', // remote settings, like if is promo turned on or off
	SAMPLE_MAP: 'sampleMap', // map stating what reviews are already viewed
	TAGS: 'tags',
	IOS_IN_APP_RATING_DIALOG_DISPLAY_STATUS: 'iosInAppRatingDialogDisplayStatus',
	APP_RATING_PLAYED_REVIEWS_COUNT: 'appRatingPlayedReviewsCount',
	APP_RATING_NEXT_RATE_DATE: 'appRatingNextRateDate',
	APP_RATING_VERSION: 'appRatingVersion',
	TRACKING_INFO: 'trackingInfo',
	TRACKING_APP_INSTALL_INFO: 'trackingAppInstallInfo',
	START_NOTIFICATIONS_SETUP: 'startNotificationsSetup'
}

export const StorageService = {
	getRemotePollingIntervalExtraTime() {
		return REMOTE_POLLING_INTERVAL_EXTRA_TIME
	},

	getExpireTime(key) {
		const expirationTimes = {}
		let expiration = null

		expirationTimes[StorageKeys.HIGHLIGHT_INFO] = 6 * 60 * 60 * 1000 // 6 hours
		expirationTimes[StorageKeys.INFO] = 60 * 60 * 1000 // 1 hour
		expirationTimes[StorageKeys.INFO_ALL] = 60 * 60 * 1000 // 1 hour
		expirationTimes[StorageKeys.COVER_INFO] = 24 * 60 * 60 * 1000 // 1 day
		expirationTimes[StorageKeys.USER_COLLECTIONS] = 5 * 60 * 1000 // 5 minutes
		expirationTimes[StorageKeys.HOME_LIST] = 60 * 60 * 1000 // 1 hour
		expirationTimes[StorageKeys.DOWNLOAD_MAP] = 10 * 365 * 24 * 60 * 60 * 1000 // 10 years
		expirationTimes[StorageKeys.VERSION] = 60 * 60 * 1000 // 1 hour
		expirationTimes[StorageKeys.AUTH_DATA] = 10 * 365 * 24 * 60 * 60 * 1000 // 1 year
		expirationTimes[StorageKeys.SETTINGS] = 5 * 60 * 1000 // 5 minutes
		expirationTimes[StorageKeys.TAGS] = 24 * 60 * 60 * 1000 // 1 day

		for (let [index] of Object.entries(expirationTimes)) {
			const regex = new RegExp(`.*?${index}$`)
			if (key.match(regex)) {
				expiration = expirationTimes[index]
				break
			}
		}

		return expiration || null
	},

	async setItem(key, data, callback, setAsModified = true) {
		const dataToStore = {
			data: data,
			_isModified: !!setAsModified
		}

		try {
			const expirationTime = this.getExpireTime(key)

			if (expirationTime) {
				const currentTimestamp = new Date().getTime()

				dataToStore._cacheExpiresAt = new Date(
					currentTimestamp + expirationTime
				)
			}

			await AsyncStorage.setItem(key, JSON.stringify(dataToStore))

			if (callback) callback()

			return true
		} catch (error) {
			console.log('Error in StorageService.setItem()', key, data, error)
			return false
		}
	},

	async clearItem(key) {
		const dataToStore = {
			data: null,
			_cacheExpiresAt: 0
		}

		try {
			await AsyncStorage.setItem(key, JSON.stringify(dataToStore))

			return true
		} catch (error) {
			console.log('Error in StorageService.clearItem() key:', key, error)
			return false
		}
	},

	async getItem(key, callback, forceUseCache) {
		let data = null
		let returnData

		try {
			data = JSON.parse(await AsyncStorage.getItem(key))

			if (
				data &&
				data._cacheExpiresAt &&
				new Date() > new Date(data._cacheExpiresAt) &&
				!forceUseCache
			) {
				data = null
			}

			returnData = data ? data.data : data

			if (callback) callback(returnData, data)
		} catch (error) {
			console.log('Error in StorageService.getItem()', key, error)
		}

		return returnData
	},

	async getIsItemExpired(key) {
		let data = null
		let returnData

		try {
			data = JSON.parse(await AsyncStorage.getItem(key))
			returnData = data ? data._cacheExpiresAt : data
		} catch (error) {
			console.log('Error in StorageService.getIsItemExpired()', error)
		}

		if (returnData) return new Date() > new Date(returnData)

		return returnData
	},

	async getIsItemModified(key, setAsNotModified = true) {
		let data = null

		try {
			data = JSON.parse(await AsyncStorage.getItem(key))

			if (setAsNotModified) {
				await this.setItem(
					key,
					data && data.data ? data.data : null,
					null,
					false
				)
			}
		} catch (error) {
			console.log('Error in StorageService.getIsItemModified()', error)
		}

		if (!data || data._isModified) {
			return true
		}

		return false
	},

	async getIsDataExpiredOrModified(key) {
		const isItemExpired = await this.getIsItemExpired(key)
		const isItemModified = await this.getIsItemModified(key)

		return isItemExpired || isItemModified
	}
}
