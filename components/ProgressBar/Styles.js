import { StyleSheet } from 'react-native'
import { colors } from '../../assets/styles/Colors'

const radius = 4

export const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		width: '100%'
	},
	barWrapper: {
		borderRadius: radius,
		height: 6,
		width: '60%',
		backgroundColor: colors.lightGrey,
		overflow: 'hidden'
	},
	bar: {
		backgroundColor: colors.slateGrey,
		height: '100%',
		width: 0,
		borderTopRightRadius: radius,
		borderBottomRightRadius: radius
	}
})
