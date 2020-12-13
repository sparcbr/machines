import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { styles } from './Styles'
import { useToastDispatch, useToastState } from '../../contexts/toast'

let handler
export const CustomToast = () => {
	const toastDispatch = useToastDispatch()
	const toastState = useToastState()

	useEffect(() => {
		if (toastState.message) {
			clearTimeout(handler)
			handler = setTimeout(
				() =>
					toastDispatch({
						type: 'update',
						payload: { message: null, duration: null }
					}),
				toastState.duration ?? 3300
			)
		}

		return () => clearTimeout(handler)
	}, [toastState])

	return toastState.message ? (
		<View style={styles.view}>
			<View style={styles.wrapper}>
				<Text style={styles.text}>{toastState.message}</Text>
			</View>
		</View>
	) : null
}
