import React, { useEffect, useState } from 'react'
import dynamicLinks from '@react-native-firebase/dynamic-links'
//import analytics from '@react-native-firebase/analytics'
import { CustomModal } from '../CustomModal/CustomModal'
import { config } from '../../config'
import {
	navigatorRef,
	getActiveRoute,
	getActiveRouteName
} from '../../navigation'
import { useModalState, useModalDispatch } from '../../contexts/modal'
import {
	useLocalNotificationsDispatch,
	useLocalNotificationsState,
	initState as localNotificationsInitState
} from '../../contexts/local-notifications'
import {
	useConfigDispatch,
	useConfigState,
	initState as configInitState
} from '../../contexts/config'
/*import {
	useAccountDispatch,
	useAccountState,
	initState as accountInitState
} from '../../contexts/account'*/
import {
	useSettingDispatch,
	useSettingState,
	initState as settingInitState
} from '../../contexts/setting'
import {
	useDimensionDispatch,
	useDimensionState,
	initState as dimensionInitState
} from '../../contexts/dimension'
import {
	useUserCollectionDispatch,
	useUserCollectionState,
	initState as userCollectionInitState,
	updateState as userCollectionUpdateState
} from '../../contexts/user-collection'
import {
	useReviewDispatch,
	useReviewState,
	initState as reviewInitState,
	updateState as reviewUpdateState
} from '../../contexts/review'
import {
	useTrackingDispatch,
	useTrackingState,
	initState as trackingInitState
} from '../../contexts/tracking'
import { useToastDispatch } from '../../contexts/toast'
import { RootStack } from '../Stacks/Stacks'
import { DeprecatedCustomToast } from '../DeprecatedCustomToast/DeprecatedCustomToast'
import { CustomToast } from '../CustomToast/CustomToast'
import { Loading } from '../Loading/Loading'
import { AccountService } from '../../services/account'
import { SettingService } from '../../services/setting'
import { UrlService } from '../../services/url'
import { isEmpty, camelCase, upperFirst } from 'lodash'
import { NavigationActions, StackActions } from 'react-navigation'

const accountService = new AccountService()
const settingService = new SettingService()

export const AppBootstrap = () => {
	const localNotificationsDispatch = useLocalNotificationsDispatch()
	const localNotificationsState = useLocalNotificationsState()
	const configDispatch = useConfigDispatch()
	const configState = useConfigState()
	const dimensionDispatch = useDimensionDispatch()
	const dimensionState = useDimensionState()
	const accountDispatch = useAccountDispatch()
	const accountState = useAccountState()
	const settingDispatch = useSettingDispatch()
	const toastDispatch = useToastDispatch()
	const settingState = useSettingState()
	const modalDispatch = useModalDispatch()
	const userCollectionDispatch = useUserCollectionDispatch()
	const userCollectionState = useUserCollectionState()
	const reviewDispatch = useReviewDispatch()
	const reviewState = useReviewState()
	const trackingDispatch = useTrackingDispatch()
	const trackingState = useTrackingState()
	const [deprecatedModal, setDeprecatedModal] = useState(null)
	const [currentAccountId, setCurrentAccountId] = useState(null)
	const [isFileSystemChecked, setIsFileSystemChecked] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [navigationAction, setNavigationAction] = useState(null)
	const [trackingInfo, setTrackingInfo] = useState(null)

	/* TODO: refactor our code to remove deprecated stuff */
	/* Everything inside this block should be removed.
			No functions in here should be consumed anymore */
	/* BEGIN refactor */
	const refs = {}
	function deprecatedShowModal(
		content,
		showCloseButton = true,
		hideCallback = null
	) {
		setDeprecatedModal({
			isVisible: true,
			content: content,
			showCloseButton: showCloseButton,
			hideCallback: hideCallback,
			lastUpdateTime: null
		})
	}

	function deprecatedHideModal(callback) {
		setDeprecatedModal({
			...deprecatedModal,
			isVisible: false
		})
		if (callback) callback()
	}

	function DeprecatedModalDisplay() {
		return deprecatedModal && deprecatedModal.isVisible ? (
			<CustomModal
				visible
				onRequestClose={() => deprecatedHideModal()}
				showCloseButton={deprecatedModal.showCloseButton}
			>
				{deprecatedModal.content}
			</CustomModal>
		) : null
	}

	function getScreenProps() {
		return {
			refs: refs,
			accountService: accountService,
			settingService: settingService,
			toast: {
				show: showToast
			},
			modal: {
				show: deprecatedShowModal,
				hide: deprecatedHideModal
			}
		}
	}

	function showToast(message, duration = 7000) {
		refs.toast.show(message, duration)
	}

	function onToastRef(ref) {
		ref && (refs.toast = ref)
	}

	useEffect(() => {
		if (!deprecatedModal) return

		if (!deprecatedModal.isVisible) {
			deprecatedModal.hideCallback && deprecatedModal.hideCallback()
		}
	}, [deprecatedModal])
	/* END refactor */

	function ModalDisplay() {
		const modalState = useModalState()
		return modalState.data && modalState.data.isVisible ? (
			<CustomModal
				onRequestClose={() => {
					modalDispatch({
						type: 'hide'
					})
					modalState.data.closeCallback && modalState.data.closeCallback()
				}}
				showCloseButton={modalState.data.showCloseButton}
				visible
			>
				{modalState.data.content}
			</CustomModal>
		) : null
	}

	function hasAccount() {
		return accountState?.data?.account?.type !== undefined
	}

	useEffect(() => {
		if (hasAccount()) {
			if (
				currentAccountId &&
				currentAccountId !== accountState.data.account.id
			) {
				userCollectionUpdateState(userCollectionDispatch, true)
				reviewUpdateState(reviewDispatch, reviewState, true)
			} else {
				userCollectionInitState(userCollectionDispatch, userCollectionState)
				reviewInitState(reviewDispatch, reviewState, toastDispatch)
			}

			setCurrentAccountId(accountState.data.account.id)
		}
	}, [accountState])

	useEffect(() => {
		if (
			isEmpty(trackingState) ||
			isEmpty(settingState) ||
			isEmpty(configState) ||
			isEmpty(dimensionState) ||
			(hasAccount() &&
				(!reviewState.isInitialized ||
					isEmpty(userCollectionState) ||
					!isFileSystemChecked))
		) {
			setIsLoading(true)
			return
		}
		setIsLoading(false)
	}, [
		settingState,
		configState,
		dimensionState,
		reviewState,
		userCollectionState,
		isFileSystemChecked,
		accountState
	])

	useEffect(() => {
		if (isFileSystemChecked || !hasAccount() || !reviewState.isInitialized)
			return

		const fsService = reviewState.instance._getFSServiceInstance()
		const dataDir = fsService.getDocumentDirectoryPath()
		const appDataCheckerFilePath = `${dataDir}/${config.appDataCheckerFileName}`

		fsService
			.exists(dataDir)
			.then(exists => {
				if (!exists) {
					console.debug('Data directory does not exist: ', dataDir)
					return false
				}

				return fsService.exists(appDataCheckerFilePath)
			})
			.then(async exists => {
				if (!exists) {
					console.debug(
						`AppDataChecker: ${appDataCheckerFilePath} does not exist. Clearing download maps!`
					)
					reviewState.instance.clearDownloadMaps(Object.keys(reviewState.data))
					await fsService.writeFile(appDataCheckerFilePath, '')
				}
				setIsFileSystemChecked(true)
			})
			.catch(e => {
				console.debug('Error checking file system:', e)
			})
	}, [reviewState, accountState])

	useEffect(() => {
		const unsubscribe = dynamicLinks().onLink(handleDynamicLink)
		dynamicLinks().getInitialLink().then(handleDynamicLink)

		settingInitState(settingDispatch, settingState)
		configInitState(configDispatch, configState)
		dimensionInitState(dimensionDispatch, dimensionState)
		accountInitState(accountDispatch, accountState)
		localNotificationsInitState(
			localNotificationsDispatch,
			localNotificationsState,
			modalDispatch
		)
		trackingInitState(trackingDispatch, trackingState)

		return () => unsubscribe()
	}, [])

	function handleDynamicLink(link) {
		if (link && link.url) {
			const urlInfo = UrlService.parse(link.url)
			if (!urlInfo) return
			const { searchParams } = urlInfo

			try {
				const payload = JSON.parse(searchParams.payload)

				setTrackingInfo(payload)

				if (!isEmpty(payload.actions)) {
					processActionsFromUrl(payload.actions)
				}
			} catch (e) {
				console.debug('Error handling link:', e)
				return
			}
		} else {
			console.debug('Invalid link:', link)
		}
	}

	function processActionsFromUrl(actions) {
		for (const [key, action] of Object.entries(actions)) {
			if (key === 'navigate') {
				const screen = upperFirst(camelCase(action.screen))
				if (
					config.allowedExternalNavigationRoutes.indexOf(screen) >= 0 &&
					('' + action.reviewId).match(/^\d+$/)
				) {
					setNavigationAction({
						routeName: screen,
						params: {
							reviewId: +action.reviewId
						}
					})
				}
			}
		}
	}

	function handleNavigationAction() {
		if (
			!navigationAction ||
			isLoading ||
			!hasAccount() ||
			!reviewState.isInitialized ||
			!navigatorRef?.current
		) {
			return
		}

		try {
			const currentRoute = getActiveRoute(navigatorRef.current.state.nav)
			if (
				navigationAction.routeName === 'PreReview' &&
				['Review', 'PreReview'].includes(currentRoute.routeName)
			) {
				if (
					currentRoute.params.reviewId === navigationAction.params?.reviewId
				) {
					setNavigationAction(null)
					return
				}
				if (currentRoute.routeName === 'Review') {
					navigatorRef.current.dispatch(StackActions.pop())
				}
			}
			navigatorRef.current.dispatch(
				NavigationActions.navigate(navigationAction)
			)
		} catch (e) {
			console.debug('Error in handleNavigationAction():', e)
		}
		setNavigationAction(null)
	}

	useEffect(() => {
		handleNavigationAction()
	}, [navigationAction, isLoading, accountState, navigatorRef])

	useEffect(() => {
		if (!trackingInfo || !trackingState.isInitialized) return

		let newTrackingInfo = {}
		if (trackingInfo.email && !trackingState.data.email) {
			newTrackingInfo.email = trackingInfo.email
		}

		if (trackingInfo.name && !trackingState.data.name) {
			newTrackingInfo.name = trackingInfo.name
		}

		if (!trackingState.data.vid) {
			newTrackingInfo = {
				...newTrackingInfo,
				...trackingState.instance.extractTrackingInfo(trackingInfo)
			}
		}

		if (!isEmpty(newTrackingInfo)) {
			trackingState.instance.saveInfo(
				trackingDispatch,
				trackingState,
				newTrackingInfo
			)

			newTrackingInfo.hid &&
				trackingState.instance.trackAppInstall(newTrackingInfo.hid)
		}

		setTrackingInfo(null)
	}, [trackingInfo, trackingState])

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<DeprecatedCustomToast onRef={onToastRef} />
					<RootStack
						onNavigationStateChange={(prevState, currentState) => {
							const currentRouteName = getActiveRouteName(currentState)
							const previousRouteName = getActiveRouteName(prevState)

							if (currentRouteName && previousRouteName !== currentRouteName) {
								analytics().setCurrentScreen(currentRouteName, currentRouteName)
							}
						}}
						uriPrefix={config.schemePrefix}
						screenProps={getScreenProps()}
						ref={navigatorRef}
					/>
					<ModalDisplay />
					<DeprecatedModalDisplay />
				</>
			)}
			<CustomToast />
		</>
	)
}
