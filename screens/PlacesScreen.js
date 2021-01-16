import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import {
	Button,
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

export const PlacesScreen = ({ navigation }) => {
	//const [searchType, setSearchType] = useState('')
	const datasetService = DatasetService.getInstance()
	const [searchName, setSearchName] = useState('')
	const [searchAddress, setSearchAddress] = useState('')
	const [name, setName] = useState('')
	const [address, setAddress] = useState('')
	const [reminder, setReminder] = useState('')
	const [data, setData] = useState([])
	const [selected, setSelected] = useState(null)

	// function useForceUpdate() {
	// 	const [value, setValue] = useState(0) // integer state
	// 	return () => setValue(value => ++value) // update the state to force render
	// }
	// const forceUpdate = useForceUpdate();
	/* useEffect(() => {
		refreshData()
	}, []) */
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

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
		  // The screen is focused
		  refreshData()
		})
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe
	}, [navigation])

	useEffect(() => {
		if (!datasetService) {
			console.debug('datasetservice is null yet 1')
			return
		}
		setSearchName(datasetService.getSearchNameFilter())
		setSearchAddress(datasetService.getSearchAddressFilter())
	}, [datasetService])

	useEffect(() => {
		if (!datasetService) {
			console.debug('datasetservice is null yet')
			return
		}
		refreshData()
	}, [searchName, searchAddress])

	/* useEffect(() => {
		console.debug('render data selected =', selected)
	}, [data, selected]) */

	console.debug('PlaceScreen data =', data, 'selected', selected)
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
							<Text style={styles.subtitle}>Local</Text>
							<TextInput
								id="name"
								value={name}
								onChangeText={text => setName(text)}
								style={styles.input}
							/>
							<Text style={styles.subtitle}>Endereço</Text>
							<TextInput
								id="address"
								value={address}
								onChangeText={text => setAddress(text)}
								style={styles.input}
							/>
							<Text style={styles.subtitle}>Observaçao</Text>
							<TextInput
								id="reminder"
								value={reminder}
								onChangeText={text => setReminder(text)}
								style={styles.input}
							/>
							<Button
								title="Adicionar local"
								onPress={() => {
									datasetService.addPlace(name, address, reminder)
									refreshData()
								}}
							/>
						</View>
						<View style={styles.container}>
							<Text style={styles.subtitle2}>Busca por nome</Text>
							<TextInput
								name="searchName"
								value={searchName}
								onChangeText={_setSearchName}
								style={styles.input}
							/>
							<Text style={styles.subtitle2}>Busca por endereço</Text>
							<TextInput
								name="searchAddress"
								value={searchAddress}
								onChangeText={_setSearchAddress}
								style={styles.input}
							/>
						</View>
						<PlacesList
							data={data}
							selected={selected}
							onSaveSelected={indices => {
								console.debug('save selected', indices)
								datasetService.setSelected(indices)
								setSelected(datasetService.getSelected())
								refreshData()
							}}
						/>

						{/* </form> */}
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}
