import { StyleSheet, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { colors } from './Colors'
import { ColorService } from '../../services/color'
import { defaults } from './Defaults'

const colorService = new ColorService()
const fonts = {
	main: {
		extraBold: 'Catamaran-ExtraBold',
		bold: 'Catamaran-Bold',
		regular: 'Catamaran-Regular'
	},
	serif: {
		regular: 'EBGaramond-Regular',
		bold: 'EBGaramond-Bold'
	}
}
const padding = 12

export const globals = {
	modals: {
		overlay: {
			backgroundColor: colorService.hexToRgbA(colors.black, 0.7)
		}
	},
	padding: padding,
	innerPadding: 40,
	screenBottomPadding: DeviceInfo.hasNotch()
		? 35
		: Platform.OS === 'android'
		? 0
		: 15,
	screenTopPadding: 30,
	screenTopMargin: DeviceInfo.hasNotch()
		? 35
		: Platform.OS === 'android'
		? 0
		: 20,
	cards: {
		borderRadius: 5
	},
	topNavBar: {
		height: 20 + padding * 2
	},
	smallButtons: {
		borderRadius: 25,
		letterSpacing: 0.7,
		color: colors.nightBlue,
		textTransform: 'uppercase',
		...Platform.select({
			ios: {
				fontSize: 15,
				lineHeight: 25,
				lateralPadding: 13,
				verticalPadding: 5
			},
			android: {
				fontSize: 13,
				lineHeight: 21,
				lateralPadding: 12,
				verticalPadding: 4
			}
		}),
		fontFamily: fonts.main.bold
	},
	bigButtons: {
		borderRadius: 35,
		letterSpacing: 0.5,
		color: colors.black,
		textTransform: 'uppercase',
		fontFamily: fonts.main.bold,
		...Platform.select({
			ios: {
				fontSize: 23,
				lineHeight: 39,
				lateralPadding: 30,
				verticalPadding: 13
			},
			android: {
				fontSize: 20,
				lineHeight: 32,
				lateralPadding: 25,
				verticalPadding: 9
			}
		})
	},
	fonts: {
		main: fonts.main,
		serif: fonts.serif
	}
}

export const getAvailableScreenHeight = dimensions => {
	return (
		dimensions.data.height -
		globals.screenTopMargin -
		globals.topNavBar.height -
		defaults.navigationTabs.height -
		globals.screenBottomPadding
	)
}

const iconPadding = 8
const iconSize = 28
const iconContainerSize = iconSize + iconPadding * 2
const iconStyles = {
	width: iconSize,
	height: iconSize
}
const iconContainerStyles = {
	width: iconContainerSize,
	height: iconContainerSize,
	padding: iconPadding
}
export const styles = StyleSheet.create({
	mainView: {
		backgroundColor: colors.beige
	},
	container: {
		borderColor: colors.lightGrey,
		borderWidth: 1,
		paddingVertical: 5
	},
	rowContainer: {
		flexDirection: 'row',
		borderColor: colors.lightGrey,
		borderWidth: 1,
		justifyContent: 'space-around',
		paddingVertical: 5
	},
	btn25p:{ width: '25%', height: 50, paddingHorizontal:24, paddingVertical: 15 },
	spinnerContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.beige,
		zIndex: 50
	},
	title: {
		...Platform.select({
			ios: {
				fontSize: 32,
				lineHeight: 32
			},
			android: {
				fontSize: 30,
				lineHeight: 30
			}
		}),
		fontFamily: globals.fonts.serif.bold,
		color: colors.nightBlue,
		paddingLeft: globals.padding,
		paddingRight: globals.padding,
		textAlign: 'left',
		marginBottom: 12,
		marginTop: 5
	},
	subtitle: {
		...Platform.select({
			ios: {
				fontSize: 22,
				lineHeight: 30
			},
			android: {
				fontSize: 20,
				lineHeight: 28
			}
		}),
		fontFamily: globals.fonts.main.regular,
		color: colors.nightBlue,
		paddingLeft: globals.padding + 4,
		paddingRight: globals.padding + 4,
		letterSpacing: 0.4,
		textAlign: 'left',
		marginBottom: 2,
		marginTop: 5
	},
	subtitle2: {
		...Platform.select({
			ios: {
				fontSize: 19
			},
			android: {
				fontSize: 19
			}
		}),
		fontFamily: globals.fonts.main.regular,
		color: colors.nightBlue,
		paddingLeft: globals.padding + 4,
		paddingRight: globals.padding + 4,
		letterSpacing: 0.4,
		textAlign: 'left',
		marginBottom: 2,
		marginTop: 5
	},
	input: {
		flex: 1,
		color: colors.nightBlue,
		borderWidth: 1,
		borderColor: colors.black,
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: 1,
		paddingRight: 1,
		...Platform.select({
			ios: {
				fontSize: 22,
				// lineHeight: 38,
				// paddingTop: 15
			},
			android: {
				fontSize: 22,
				// lineHeight: 30,
				// paddingTop: 18
			}
		}),
		marginLeft: globals.padding + 10,
		marginRight: globals.padding + 10,
		marginBottom: 5,
		textAlignVertical: 'bottom',
		includeFontPadding: false
	},
	btn25p:{ width: '25%', padding: 5, margin: 5 },
	playIconContainer: iconContainerStyles,
	playIcon: iconStyles,
	shareIconContainer: iconContainerStyles,
	shareIcon: iconStyles,
	rightSideContentContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	topNavBarRightSideContent: {
		width: 170
	},
	buttonGroupContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: colors.lightGrey,
		borderWidth: 1
	},
	buttonDivider: {
		borderRightWidth: 1,
		borderRightColor: colors.lightGrey
	},
	lastButtonGroupContainer: {
		marginRight: globals.padding
	},
	buttonGroupSeparator: {
		marginRight: globals.padding / 2
	}
})
