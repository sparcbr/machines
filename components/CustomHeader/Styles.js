import { StyleSheet, Platform } from 'react-native'
import { colors } from '../../assets/styles/Colors'
import { globals } from '../../assets/styles/Globals'

export const styles = StyleSheet.create({
	wrapper: {
		marginTop: globals.screenTopMargin,
		flexDirection: 'column',
		alignItems: 'center'
	},
	title: {
		color: colors.white,
		marginBottom: 15,
		paddingLeft: globals.innerPadding,
		paddingRight: globals.innerPadding,
		textAlign: 'center',
		...Platform.select({
			ios: {
				fontSize: 27,
				lineHeight: 33
			},
			android: {
				fontSize: 25,
				lineHeight: 31
			}
		}),
		fontFamily: globals.fonts.main.extraBold
	},
	line: {
		height: 2,
		width: 100,
		backgroundColor: colors.blue,
		marginBottom: 55
	}
})
