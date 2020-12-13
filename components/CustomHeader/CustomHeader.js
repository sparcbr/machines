import React from 'react'
import { Text, View } from 'react-native'
import { styles } from './Styles'

export const CustomHeader = ({ title, subScreen, icon }) => {
	let wrapperStyles = styles.wrapper

	if (subScreen) {
		wrapperStyles = {
			...wrapperStyles,
			marginTop: 0
		}
	}

	return (
		<View style={wrapperStyles}>
			{icon ? icon : null}
			<Text numberOfLines={4} ellipsizeMode="middle" style={styles.title}>
				{title}
			</Text>
			<View style={styles.line} />
		</View>
	)
}
