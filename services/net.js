import NetInfo from '@react-native-community/netinfo'

export const OFFLINE = 'offline'
export const OFFLINE_MESSAGE = 'Conecte-se à Internet'

export class NetService {
	async checkConnectivity() {
		const isConnected = await NetInfo.isConnected.fetch()

		if (isConnected) return true
		throw new Error(OFFLINE)
	}
}
