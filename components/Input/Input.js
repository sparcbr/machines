import React from 'react'
import { TextInput, View, Text, Image, TouchableOpacity } from 'react-native'
import { styles } from './Styles'
import { colors } from '../../assets/styles/Colors'
import magnifierIconInactive from '../../assets/images/magnifier-icon-inactive.png'
import closeIconActive from '../../assets/images/close-icon-active.png'
import closeIconActiveInverse from '../../assets/images/close-icon-active-inverse.png'

export class Input extends React.PureComponent {
	state = {
		value: this.props.defaultValue || '',
		hasContent:
			this.props.defaultValue && !(this.props.defaultValue.length === 0),
		isFocused: false
	}
	constructor(props) {
		super(props)
		this._handleInputFocus = this._handleInputFocus.bind(this)
		this._handleInputBlur = this._handleInputBlur.bind(this)
	}

	_handleChangeText(value) {
		const { onChangeText } = this.props

		if (onChangeText) {
			value = onChangeText(value)
		}

		this.setState({
			value,
			hasContent: !(value.length === 0)
		})
	}

	_handleInputFocus() {
		const { onFocus } = this.props

		if (onFocus) onFocus()

		this.setState({
			isFocused: true
		})
	}

	_handleInputBlur() {
		const { onBlur } = this.props

		if (onBlur) onBlur()

		this.setState({
			isFocused: false
		})
	}

	_renderIcon() {
		const { theme } = this.props

		return theme === 'search' ? (
			<Image source={magnifierIconInactive} style={styles.searchThemeIcon} />
		) : null
	}

	_renderCloseIcon() {
		const { theme, showCloseIcon, onClose } = this.props
		const { isFocused } = this.state

		if (theme === 'search' && showCloseIcon === true) {
			return (
				<TouchableOpacity
					style={styles.searchThemeCloseButton}
					onPress={() => {
						this.inputRef.blur()
						if (onClose) onClose()
					}}
				>
					<Image
						source={isFocused ? closeIconActiveInverse : closeIconActive}
						style={styles.searchThemeCloseIcon}
					/>
				</TouchableOpacity>
			)
		}

		return null
	}

	render() {
		const innerWrapperStyles = [styles.innerWrapper]
		const inputStyles = [styles.input]
		const labelContainerStyles = [styles.labelContainer]
		const labelTextStyles = [styles.labelText]
		const allowedProps = [
			'placeholder',
			'placeholderTextColor',
			'autoCapitalize',
			'textContentType',
			'secureTextEntry',
			'returnKeyLabel',
			'onSubmitEditing',
			'defaultValue'
		]
		const inputProps = {
			autoCorrect: false,
			textAlignVertical: 'center',
			underlineColorAndroid: 'transparent',
			selectionColor: colors.blue,
			onChangeText: value => this._handleChangeText(value)
		}
		const { label, error, styleData, theme, showCloseIcon } = this.props
		const { hasContent, isFocused, value } = this.state

		allowedProps.forEach(item => {
			if (this.props[item] !== undefined) {
				inputProps[item] = this.props[item]
			}
		})

		if (theme === 'search') {
			inputStyles.push(styles.searchThemeInput)
			innerWrapperStyles.push(styles.searchThemeInnerWrapper)
			labelContainerStyles.push(styles.searchThemeLabelContainer)
			labelTextStyles.push(styles.searchThemeLabelText)

			if (showCloseIcon) {
				labelContainerStyles.push(styles.searchThemeLabelContainerWithIcon)
			}
		}

		if (styleData && styleData.innerWrapper) {
			innerWrapperStyles.push(styleData.innerWrapper)
		}

		if (styleData && styleData.input) {
			inputStyles.push(styleData.input)
		}

		if (styleData && styleData.labelContainer) {
			labelContainerStyles.push(styleData.labelContainer)
		}

		if (styleData && styleData.labelText) {
			labelTextStyles.push(styleData.labelText)
		}

		if (hasContent) {
			inputStyles.push(styles.hasContentInput)
		}

		if (isFocused) {
			inputStyles.push(styles.hasFocusInput)
			innerWrapperStyles.push(styles.hasFocusInnerWrapper)

			if (styleData && styleData.hasFocusInput) {
				inputStyles.push(styleData.hasFocusInput)
			}

			if (styleData && styleData.hasFocusInnerWrapper) {
				innerWrapperStyles.push(styleData.hasFocusInnerWrapper)
			}
		}

		if (isFocused || hasContent) {
			labelContainerStyles.push(styles.hasFocusLabelContainer)
			labelTextStyles.push(styles.hasFocusLabelText)

			if (theme === 'search') {
				labelContainerStyles.push(styles.searchThemeHasFocusLabelContainer)
				labelTextStyles.push(styles.searchThemeHasFocusLabelText)

				if (hasContent) {
					labelContainerStyles.push(styles.searchThemeHasContentLabelContainer)
					labelTextStyles.push(styles.searchThemeHasContentLabelText)
				}
			}

			if (styleData && styleData.hasFocusLabelContainer) {
				labelContainerStyles.push(styleData.hasFocusLabelContainer)
			}

			if (styleData && styleData.hasFocusLabelText) {
				labelTextStyles.push(styleData.hasFocusLabelText)
			}

			if (styleData && styleData.hasContentInput) {
				inputStyles.push(styleData.hasContentInput)
			}
		}

		if (error) {
			innerWrapperStyles.push(styles.hasErrorInnerWrapper)
		}

		return (
			<View style={styles.wrapper}>
				{/** https://stackoverflow.com/questions/51730122/textinput-in-react-native-show-text-value-with-a-color-background */}
				<View style={innerWrapperStyles}>
					<TextInput
						ref={ref => (this.inputRef = ref)}
						style={inputStyles}
						placeholderTextColor={colors.nightUltraLightBlue}
						onFocus={this._handleInputFocus}
						onBlur={this._handleInputBlur}
						{...inputProps}
						value={value}
					/>
					{this._renderIcon()}
					<View pointerEvents="none" style={labelContainerStyles}>
						<Text
							numberOfLines={1}
							ellipsizeMode={'tail'}
							style={labelTextStyles}
						>
							{label}
						</Text>
					</View>
					{this._renderCloseIcon()}
				</View>
			</View>
		)
	}
}
