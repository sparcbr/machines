import { StyleSheet, Platform } from 'react-native'
import { colors } from '../../assets/styles/Colors'
import { globals } from '../../assets/styles/Globals'
import { defaults } from '../../assets/styles/Defaults'

export const height =
	defaults.navigationTabs.defaultButtonHeight +
	defaults.navigationTabs.wrapperTopPadding +
	1
export const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: colors.nightLightBlue,
		height: height + globals.screenBottomPadding - 1
	},
	wrapper: {
		height: height,
		borderTopWidth: 1,
		borderTopColor: colors.nightUltraLightBlue,
		paddingTop: 2,
		paddingLeft: globals.padding,
		paddingRight: globals.padding
	},
	view: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	button: {
		height: defaults.navigationTabs.defaultButtonHeight,
		width: defaults.navigationTabs.defaultButtonWidth
	},
	buttonTouchable: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	activeButton: {
		opacity: 1
	},
	buttonText: {
		color: colors.slateGrey,
		...Platform.select({
			ios: {
				fontSize: 14,
				lineHeight: 24
			},
			android: {
				fontSize: 13,
				lineHeight: 23
			}
		}),
		fontFamily: globals.fonts.main.regular
	},
	buttonTextActive: {
		color: colors.white
	},
	icon: {
		width: 28,
		height: 28
	},
	yellowButtonContainer: {
		...Platform.select({
			ios: { marginTop: 8 },
			android: { marginTop: 10 }
		}),
		marginLeft: 15,
		marginRight: 15,
		height: 38,
		paddingLeft: 15,
		paddingRight: 15,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: globals.smallButtons.borderRadius
	},
	yellowButtonContent: {
		color: globals.smallButtons.color,
		textTransform: globals.smallButtons.textTransform,
		fontSize: globals.smallButtons.fontSize,
		lineHeight: globals.smallButtons.lineHeight,
		fontFamily: globals.smallButtons.fontFamily,
		letterSpacing: globals.smallButtons.letterSpacing
	}
})
