import React from 'react'
import { View } from 'react-native'
import { styles } from './Styles'

export const ProgressBar = props => {
	const { status } = props
	const barStyles = { ...styles.bar }

	barStyles.width = `${status}%`

	return (
		<View style={styles.container}>
			<View style={styles.barWrapper}>
				<View style={barStyles}></View>
			</View>
		</View>
	)
}
