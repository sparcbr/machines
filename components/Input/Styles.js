import { StyleSheet, Platform } from 'react-native'
import { globals } from '../../assets/styles/Globals'
import { colors } from '../../assets/styles/Colors'
import { ColorService } from '../../services/color'

const colorService = new ColorService()
const searchThemeLabelContainerBaseStyling = {
	...Platform.select({
		ios: {
			top: 14
		},
		android: {
			top: 11
		}
	})
}
const searchThemeLabelTextBaseStyling = {
	...Platform.select({
		ios: {
			fontSize: 19,
			lineHeight: 25
		},
		android: {
			fontSize: 17,
			lineHeight: 23
		}
	})
}

export const styles = StyleSheet.create({
	wrapper: {
		position: 'relative',
		marginLeft: globals.innerPadding,
		marginRight: globals.innerPadding,
		marginBottom: globals.padding
	},
	innerWrapper: {
		backgroundColor: colorService.hexToRgbA(colors.nightBlue, 0.6),
		borderRadius: 8,
		borderColor: colors.nightUltraLightBlue,
		borderWidth: 1
	},
	input: {
		fontFamily: globals.fonts.main.regular,
		color: colors.white,
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: globals.padding,
		paddingRight: globals.padding,
		...Platform.select({
			ios: {
				height: 70,
				fontSize: 22,
				lineHeight: 38,
				paddingTop: 15
			},
			android: {
				height: 65,
				fontSize: 19,
				lineHeight: 30,
				paddingTop: 18
			}
		}),
		textAlignVertical: 'bottom',
		includeFontPadding: false
	},
	hasFocusInnerWrapper: {
		backgroundColor: colors.white,
		borderColor: colors.nightLightBlue
	},
	hasFocusInput: {
		color: colors.nightBlue
	},
	labelContainer: {
		position: 'absolute',
		left: globals.padding,
		right: globals.padding,
		...Platform.select({
			ios: {
				top: 16
			},
			android: {
				top: 19
			}
		}),
		marginBottom: 5
	},
	labelText: {
		fontFamily: globals.fonts.main.bold,
		color: colors.white,
		...Platform.select({
			ios: {
				fontSize: 22,
				lineHeight: 38
			},
			android: {
				fontSize: 19,
				lineHeight: 29
			}
		})
	},
	hasFocusLabelContainer: {
		...Platform.select({
			ios: {
				top: 11
			},
			android: {
				top: 9
			}
		})
	},
	hasFocusLabelText: {
		color: colors.nightUltraLightBlue,
		...Platform.select({
			ios: {
				fontSize: 16,
				lineHeight: 20
			},
			android: {
				fontSize: 14,
				lineHeight: 18
			}
		})
	},
	hasContentInput: {},
	hasErrorInnerWrapper: {
		borderColor: colors.orange
	},
	searchThemeInnerWrapper: {
		shadowColor: colors.black,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.43,
		shadowRadius: 2.62,
		elevation: 4
	},
	searchThemeInput: {
		paddingLeft: 43,
		paddingRight: 47,
		paddingTop: 0,
		...Platform.select({
			ios: {
				height: 45,
				fontSize: 19,
				lineHeight: 32
			},
			android: {
				height: 40,
				fontSize: 17,
				lineHeight: 27
			}
		})
	},
	searchThemeLabelContainer: {
		left: 43,
		...searchThemeLabelContainerBaseStyling
	},
	searchThemeLabelText: {
		color: colors.slateGrey,
		fontFamily: globals.fonts.main.regular,
		...searchThemeLabelTextBaseStyling
	},
	searchThemeHasFocusLabelContainer: {
		...searchThemeLabelContainerBaseStyling,
		right: 47
	},
	searchThemeLabelContainerWithIcon: {
		right: 47
	},
	searchThemeHasFocusLabelText: {
		...searchThemeLabelTextBaseStyling
	},
	searchThemeHasContentLabelContainer: {
		/** display: none + position: absolute doesn't work on Android
			https://github.com/facebook/react-native/issues/18415  */
		display: 'none',
		position: 'relative'
	},
	searchThemeHasContentLabelText: {},
	searchThemeIcon: {
		position: 'absolute',
		...Platform.select({
			ios: {
				top: 11
			},
			android: {
				top: 9
			}
		}),
		left: 12,
		width: 24,
		height: 24
	},
	searchThemeCloseButton: {
		position: 'absolute',
		right: globals.padding - 20,
		...Platform.select({
			ios: {
				top: -5
			},
			android: {
				top: -7
			}
		}),
		padding: 15
	},
	searchThemeCloseIcon: {
		width: 24,
		height: 24
	}
})
