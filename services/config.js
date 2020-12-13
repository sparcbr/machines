import { Platform } from 'react-native'
import { UrlService } from './url'
import { ObjectService } from './object'
import { config } from '../config'

const TRACKING_PARAM_NAMES_MAP = {
	vid: 'flux_visitor',
	sid: 'flux_sess',
	email: 'e',
	name: 'n'
}

export class ConfigService {
	getLandingPageUrl(data, trackingState) {
		return UrlService.combine(Platform.select(config.landingPageUrl), {
			...data,
			...ObjectService.replaceKeys(TRACKING_PARAM_NAMES_MAP, {
				...trackingState.data
			})
		})
	}
}
