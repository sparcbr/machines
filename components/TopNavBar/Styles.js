import { StyleSheet } from 'react-native'
import { globals } from '../../assets/styles/Globals'

export const styles = StyleSheet.create({
	wrapper: {
		height: globals.topNavBar.height,
		flexDirection: 'row'
	},
	backArrowWrapper: {
		justifyContent: 'center',
		height: '100%'
	},
	backArrow: {
		marginLeft: globals.padding - 5, // 5 = image inner canvas padding
		width: 28,
		height: 28
	},
	sideContent: {
		width: 70
	},
	mainContent: {
		flex: 1
	}
})
