import { Platform, StyleSheet } from 'react-native'
import { globals } from '../../assets/styles/Globals'
import { colors } from '../../assets/styles/Colors'

export const styles = StyleSheet.create({
	view: {
		position: 'absolute',
		top: globals.screenTopMargin + globals.screenTopPadding,
		left: 0,
		alignItems: 'center',
		width: '100%',
		paddingLeft: globals.padding,
		paddingRight: globals.padding,
		zIndex: 10000
	},
	wrapper: {
		elevation: 1,
		shadowColor: colors.black,
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 1,
		shadowRadius: 15
	},
	text: {
		borderRadius: 5,
		overflow: 'hidden',
		paddingTop: 10,
		paddingBottom: 5,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: colors.orange,
		...Platform.select({
			ios: {
				fontSize: 20,
				lineHeight: 25
			},
			android: {
				fontSize: 18,
				lineHeight: 23
			}
		}),
		color: colors.white,
		textAlign: 'center',
		fontFamily: globals.fonts.main.regular
	}
})
