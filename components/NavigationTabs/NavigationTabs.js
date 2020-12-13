import React from 'react'
import { SafeAreaView, TouchableOpacity, View, Text, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useModalDispatch } from '../../contexts/modal'
import { useAccountState } from '../../contexts/account'
import { useSettingState } from '../../contexts/setting'
import { PremiumModal } from '../../components/PremiumModal/PremiumModal'
import { styles } from './Styles'
import { colors } from '../../assets/styles/Colors'
import discoverIconActive from '../../assets/images/discover-icon-active.png'
import discoverIconInactive from '../../assets/images/discover-icon-inactive.png'
import libraryIconActive from '../../assets/images/library-icon-active.png'
import libraryIconInactive from '../../assets/images/library-icon-inactive.png'
import accountIconActive from '../../assets/images/account-icon-active.png'
import accountIconInactive from '../../assets/images/account-icon-inactive.png'

export const NavigationTabs = ({
	navigation,
	navigation: {
		state: { routes }
	}
}) => {
	const currentNode = [...routes].pop()
	const settingState = useSettingState()
	const accountState = useAccountState()
	const accountType =
		accountState !== null &&
		accountState.data &&
		accountState.data.account &&
		accountState.data.account.type !== undefined
			? accountState.data.account.type
			: undefined
	const isSalesOpen =
		settingState.data &&
		settingState.data.isSalesOpen &&
		settingState.data.isSalesOpen.value !== undefined
			? settingState.data.isSalesOpen.value
			: undefined

	function GoPremiumButton() {
		const dispatch = useModalDispatch()
		const goPremiumButtonStyles = [styles.yellowButtonContainer]

		if (['free', 'freemium'].includes(accountType) && isSalesOpen === true) {
			return (
				<TouchableOpacity
					onPress={() =>
						dispatch({
							type: 'show',
							payload: {
								data: { content: <PremiumModal trackingSource={'tab-bar'} /> }
							}
						})
					}
				>
					<LinearGradient
						colors={[colors.orange, colors.yellow]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={goPremiumButtonStyles}
					>
						<Text style={styles.yellowButtonContent}>Premium</Text>
					</LinearGradient>
				</TouchableOpacity>
			)
		}

		return null
	}

	function HomeButton() {
		let source = discoverIconInactive
		const textStyles = [styles.buttonText]

		if (['Home', 'SearchResults'].includes(currentNode.routeName)) {
			source = discoverIconActive
			textStyles.push(styles.buttonTextActive)
		}

		return (
			<View style={styles.button}>
				<TouchableOpacity
					style={styles.buttonTouchable}
					onPress={handleGoToHome}
				>
					<Image style={styles.icon} source={source} />
					<Text style={textStyles}>Descubra</Text>
				</TouchableOpacity>
			</View>
		)
	}

	function AccountButton() {
		const textStyles = [styles.buttonText]
		let source = accountIconInactive

		if (['SignInInternal', 'Account'].includes(currentNode.routeName)) {
			source = accountIconActive
			textStyles.push(styles.buttonTextActive)
		}

		if (['free', 'freemium'].includes(accountType)) {
			return (
				<View style={styles.button}>
					<TouchableOpacity
						style={styles.buttonTouchable}
						onPress={handleGoToAccount}
					>
						<Image style={styles.icon} source={source} />
						<Text style={textStyles}>Conta</Text>
					</TouchableOpacity>
				</View>
			)
		}

		return null
	}

	function LibraryButton() {
		const textStyles = [styles.buttonText]
		let source = libraryIconInactive

		if (currentNode.routeName === 'UserCollection') {
			source = libraryIconActive
			textStyles.push(styles.buttonTextActive)
		}

		return (
			<View style={styles.button}>
				<TouchableOpacity
					style={styles.buttonTouchable}
					onPress={handleGoToCollections}
				>
					<Image style={styles.icon} source={source} />
					<Text style={textStyles}>Biblioteca</Text>
				</TouchableOpacity>
			</View>
		)
	}

	function handleGoToAccount() {
		navigation.navigate('SignInInternal', {
			internal: true
		})
	}

	function handleGoToHome() {
		navigation.navigate('Home')
		popToTop()
	}

	function handleGoToCollections() {
		navigation.navigate('UserCollection')
		popToTop()
	}

	function popToTop() {
		setTimeout(() => {
			navigation.popToTop()
		}, 500)
	}

	function BarButtons() {
		return isSalesOpen !== undefined && accountType !== undefined ? (
			<View style={styles.view}>
				<HomeButton />
				<LibraryButton />
				<AccountButton />
				<GoPremiumButton />
			</View>
		) : null
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.wrapper}>
				<BarButtons />
			</View>
		</SafeAreaView>
	)
}
