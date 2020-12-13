import DeviceInfo from 'react-native-device-info'
import { StorageService, StorageKeys } from './storage'

export class DeviceService {
	getUUID() {
		return DeviceInfo.getUniqueId()
	}

	setUUID(uuid) {
		return StorageService.setItem(StorageKeys.UUID, uuid)
	}
}
