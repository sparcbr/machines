import React from 'react'
import { ActivityIndicator } from 'react-native'
import { colors } from '../../assets/styles/Colors'

export const Spinner = props => {
	const { color, size, styles } = props
	let spinnerColor = colors.white
	let spinnerSize = 'small'
	let spinnerStyle = []

	if (color) spinnerColor = color

	if (size) spinnerSize = size

	if (styles) spinnerStyle = [...spinnerStyle, ...styles]

	return (
		<ActivityIndicator
			size={spinnerSize}
			color={spinnerColor}
			style={spinnerStyle}
		/>
	)
}
