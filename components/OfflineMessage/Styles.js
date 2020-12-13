import { StyleSheet, Platform } from 'react-native'
import { colors } from '../../assets/styles/Colors'
import { globals } from '../../assets/styles/Globals'

export const styles = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		width: '100%',
		height: '100%',
		zIndex: 90
	},
	offlineMessage: {
		color: colors.white,
		...Platform.select({
			ios: {
				fontSize: 25,
				lineHeight: 35
			},
			android: {
				fontSize: 23,
				lineHeight: 33
			}
		}),
		textAlign: 'center',
		fontFamily: globals.fonts.main.bold,
		marginBottom: 20
	}
})
