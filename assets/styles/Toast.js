/** DEPRECATED!! SHOULD BE REMOVED WHEN WE
 * GET RID OF <DeprecatedCustomToast />
 */
import { Platform } from 'react-native'
import { globals } from './Globals'
import { colors } from './Colors'

export const viewStyles = {
	backgroundColor: colors.orange,
	borderRadius: 5,
	paddingTop: 10,
	paddingBottom: 5,
	paddingLeft: 15,
	paddingRight: 15
}

export const textStyles = {
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
