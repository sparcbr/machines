import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../../assets/styles/Colors'
import { Spinner } from '../Spinner/Spinner'
import { styles } from './Styles'

function Button(props) {
	const {
		onPress,
		isLoading,
		label,
		children,
		styleData,
		spinnerColor,
		theme
	} = props
	const buttonStyles = []
	function renderYellowTheme() {
		return (
			renderLoader() || (
				<LinearGradient
					colors={[colors.orange, colors.yellow]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={styles.button}
				>
					{renderCta(styles.yellowButtonText)}
				</LinearGradient>
			)
		)
	}
	function renderGreenTheme() {
		return (
			renderLoader() || (
				<LinearGradient
					colors={[colors.green, colors.lightGreen]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={styles.button}
				>
					{renderCta(styles.greenButtonText)}
				</LinearGradient>
			)
		)
	}
	function renderBlueTheme() {
		return (
			renderLoader() || (
				<View style={{ ...styles.button, ...styles.blueButton }}>
					{renderCta(styles.blueButtonText)}
				</View>
			)
		)
	}
	function renderDefaultTheme() {
		return (
			renderLoader() || (
				<View style={{ ...styles.button, ...styles.defaultButton }}>
					{renderCta()}
				</View>
			)
		)
	}
	function renderMiniLightWhiteTheme() {
		return (
			renderLoader() || (
				<View style={{ ...styles.miniButton, ...styles.miniLightWhiteButton }}>
					{renderCta(styles.miniButtonText)}
				</View>
			)
		)
	}
	function renderCta(additionalTextStyle) {
		const textStyles = [styles.defaultButtonText, additionalTextStyle]

		if (styleData && styleData.text) {
			textStyles.push(styleData.text)
		}

		return label ? (
			<Text
				numberOfLines={1}
				ellipsizeMode={'tail'}
				adjustsFontSizeToFit={true}
				minimumFontScale={0.7}
				style={textStyles}
			>
				{label}
			</Text>
		) : (
			children
		)
	}
	function renderLoader() {
		if (isLoading) {
			return (
				<View style={styles.button}>
					<Spinner color={spinnerColor} />
				</View>
			)
		}

		return null
	}
	function renderContent() {
		let content

		switch (theme) {
			case 'miniLightWhite':
				content = renderMiniLightWhiteTheme()
				break

			case 'green':
				content = renderGreenTheme()
				break

			case 'yellow':
				content = renderYellowTheme()
				break

			case 'blue':
				content = renderBlueTheme()
				break

			default:
				content = renderDefaultTheme()
				break
		}

		return content
	}

	if (styleData && styleData.button) buttonStyles.push(styleData.button)

	return (
		<TouchableOpacity
			disabled={isLoading}
			onPress={e => onPress(e)}
			style={buttonStyles}
		>
			{renderContent()}
		</TouchableOpacity>
	)
}

export { Button }
