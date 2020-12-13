import { StyleSheet, Platform } from 'react-native'
import { globals } from '../../assets/styles/Globals'
import { colors } from '../../assets/styles/Colors'

const height = 55
const miniHeight = 30

export const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		paddingLeft: globals.bigButtons.lateralPadding,
		paddingRight: globals.bigButtons.lateralPadding,
		height: height,
		borderRadius: globals.bigButtons.borderRadius,
		textAlign: 'center'
	},
	miniButton: {
		height: miniHeight,
		justifyContent: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 20,
		textAlign: 'center'
	},
	defaultButton: {
		backgroundColor: colors.white
	},
	defaultButtonText: {
		color: globals.bigButtons.color,
		fontFamily: globals.bigButtons.fontFamily,
		fontSize: globals.bigButtons.fontSize,
		lineHeight: globals.bigButtons.lineHeight,
		letterSpacing: globals.bigButtons.letterSpacing,
		textTransform: globals.bigButtons.textTransform,
		textAlign: 'center'
	},
	miniLightWhiteButton: {
		borderColor: colors.white,
		borderWidth: 1
	},
	miniButtonText: {
		color: colors.white,
		fontFamily: globals.smallButtons.fontFamily,
		fontSize: globals.smallButtons.fontSize,
		lineHeight: globals.smallButtons.lineHeight,
		letterSpacing: globals.smallButtons.letterSpacing,
		textTransform: globals.smallButtons.textTransform
	},
	blueButton: {
		backgroundColor: colors.blue
	},
	blueButtonText: {
		color: colors.white
	},
	yellowButtonText: {
		color: colors.nightBlue
	},
	greenButtonText: {
		color: colors.nightBlue,
		...Platform.select({
			ios: {
				paddingTop: 3
			}
		})
	}
})
