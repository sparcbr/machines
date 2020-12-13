import React from 'react'
import { View, Text } from 'react-native'
import { Button } from '../../components/Button/Button'
import { styles } from './Styles'

export const OfflineMessage = props => {
	const { onPress } = props

	return (
		<View style={styles.wrapper}>
			<View style={styles.content}>
				<Text style={styles.offlineMessage}>Você está offline :/</Text>
				<Button
					onPress={onPress}
					theme="miniLightWhite"
					label="Tentar novamente"
				/>
			</View>
		</View>
	)
}
