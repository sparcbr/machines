import React from 'react'
import { View } from 'react-native'
import { Spinner } from '../Spinner/Spinner'
import { styles as mainStyles } from '../../screens/Styles'
import { styles } from './Styles'

function Loading() {
	return (
		<View style={mainStyles.mainView}>
			<View style={styles.contentOuterWrapper}>
				<View style={styles.spinnerContainer}>
					<Spinner />
				</View>
			</View>
		</View>
	)
}

export { Loading }
