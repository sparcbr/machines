import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	TextInput,
	View
} from 'react-native'
import { styles } from '../assets/styles/Globals'
import { DatasetService } from '../services/dataset'
import { PlacesList } from './PlacesList'

export const HomeScreen = ({ navigation }) => {
	const datasetService = DatasetService.getInstance()
	const [searchName, setSearchName] = useState('')
	const [searchAddress, setSearchAddress] = useState('')
	const [data, setData] = useState(null)
	const [selected, setSelected] = useState([])
	const [, updateState] = React.useState()
	const forceUpdate = React.useCallback(() => updateState({}), [])

	function refreshData() {
		if (!datasetService) return
		// console.debug('data=', data)
		if (isEmpty(searchName) && isEmpty(searchAddress)) {
			setData(datasetService.getData())
			setSelected(datasetService.getSelected())
		} else {
			setSelected(datasetService.getSelected())
			setData(
				datasetService.getData().filter(e => {
					return (
						(!isEmpty(searchName) &&
							e.name.toLowerCase().indexOf(searchName.toLowerCase()) >= 0) ||
						(!isEmpty(searchAddress) &&
							e.address.toLowerCase().indexOf(searchAddress.toLowerCase()) >= 0)
					)
				})
			)
		}
		forceUpdate()
	}

	function _setSearchName(text) {
		setSearchName(text)
		datasetService.setFilter(text, searchAddress)
	}
	function _setSearchAddress(text) {
		setSearchAddress(text)
		datasetService.setFilter(searchName, text)
	}
	useEffect(() => {
		if (!datasetService) {
			console.debug('datasetservice is null yet 1')
			return
		}
		setSearchName(datasetService.getSearchNameFilter())
		setSearchAddress(datasetService.getSearchAddressFilter())
	}, [datasetService])

	useEffect(() => {
		if (!datasetService) return
		refreshData()
	}, [searchName, searchAddress])

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
		  // The screen is focused
		  refreshData()
		})
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe
	}, [navigation])
	return (
		<>
			<SafeAreaView>
				<StatusBar barStyle="dark-content" />
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					style={styles.scrollView}
				>
					<View style={styles.body}>
						<Text style={styles.title}>Locais</Text>
						<View style={styles.container}>
							<Text style={styles.subtitle}>Busca por nome</Text>
							<TextInput
								name="searchName"
								value={searchName}
								onChangeText={text => _setSearchName(text)}
								style={styles.input}
							/>
							<Text style={styles.subtitle}>Busca por endereço</Text>
							<TextInput
								name="searchAddress"
								value={searchAddress}
								onChangeText={text => _setSearchAddress(text)}
								style={styles.input}
							/>
						</View>
						<PlacesList
							data={data}
							selected={selected}
							onSaveSelected={indices => {
								datasetService.setSelected(indices)
								setSelected(datasetService.getSelected())
								refreshData()
							}}
							isHomeScreen={1}
						/>
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}
