import { AppEventsLogger } from 'react-native-fbsdk'

export const Events = {
	STARTED_FREE_TRIAL: {
		name: 'Started Free Trial'
	},
	BECAME_FREEMIUM: {
		name: 'Became Freemium'
	},
	RATED_NPS: {
		name: 'Rated NPS'
	}
}

export class EventService {
	log(settingState, event, data) {
		if (settingState.data.isSalesOpen.value === true) {
			const params = []

			params.push(event.name)

			if (data) params.push(data)
			else if (event.data) params.push(event.data)

			AppEventsLogger.logEvent(...params)
		}
	}
}
