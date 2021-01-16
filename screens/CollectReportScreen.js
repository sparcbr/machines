import { isEmpty, trim } from 'lodash'
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
import { CollectsTable } from './CollectsTable'
import DateTimePicker from '@react-native-community/datetimepicker'
import { DateUtil } from '../shared/date'

export const CollectReportScreen = ({ navigation }) => {
	const datasetService = DatasetService.getInstance()
	const [searchName, setSearchName] = useState('')
	const [searchAddress, setSearchAddress] = useState('')
	const [searchNameRef, setSearchNameRef] = useState(null)

	const [date, setDate] = useState(DateUtil.monthsFromNow(3))
	const [dateStr, setDateStr] = useState(
		DateUtil.formatDate(DateUtil.monthsFromNow(3))
	)
	const [showDatePicker, setShowDatePicker] = useState(false)

	const [date2, setDate2] = useState(new Date())
	const [dateStr2, setDateStr2] = useState(DateUtil.formatDate(new Date()))
	const [dateStr2Ref, setDateStr2Ref] = useState(null)
	const [showDatePicker2, setShowDatePicker2] = useState(false)

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date
		setShowDatePicker(false)
		if (DateUtil.isValidDate(currentDate)) {
			setDateStr(DateUtil.formatDate(currentDate))
			dateStr2Ref && dateStr2Ref.focus()
		}
		setDate(currentDate)
	}

	function _setDate(_text) {
		let text = trim(_text)
		if (!DateUtil.isValidStringDate(text)) {
			setDateStr(text)
			return
		}
		const currentDate = new Date(text)
		if (DateUtil.isValidDate(currentDate)) {
			setDateStr(DateUtil.formatDate(currentDate))
			setDate(currentDate)
			return
		}
		setDateStr(text)
	}
	const onChange2 = (event, selectedDate) => {
		const currentDate = selectedDate || date2
		setShowDatePicker2(false)
		if (DateUtil.isValidDate(currentDate)) {
			setDateStr2(DateUtil.formatDate(currentDate))
			searchNameRef && searchNameRef.focus()
		}
		setDate2(currentDate)
	}
	function _setDate2(_text) {
		let text = trim(_text)
		if (!DateUtil.isValidStringDate(text)) {
			setDateStr2(text)
			return
		}
		const currentDate = new Date(text)
		if (DateUtil.isValidDate(currentDate)) {
			setDateStr2(DateUtil.formatDate(currentDate))
			setDate2(currentDate)
			return
		}
		setDateStr2(text)
	}

	const [data, setData] = useState([])
	const [selected, setSelected] = useState(null)

	const [, updateState] = React.useState()
	const forceUpdate = React.useCallback(() => updateState({}), [])
	function updatePlaceData() {
		if (!datasetService) return
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
		if (!datasetService) {
			console.debug('datasetservice is null yet')
			return
		}
		updatePlaceData()
	}, [searchName, searchAddress])

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			// The screen is focused
			updatePlaceData()
		})

		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe
	}, [navigation])

	useEffect(() => {
		updateCollectTable()
	}, [selected, date, date2])

	const [collectData, setCollectData] = useState({})

	function updateCollectTable() {
		console.debug('updateCollectTable date2', date, date2)
		if (!datasetService) return
		//if (isEmpty(date) || isEmpty(date2)) return
		setCollectData(datasetService.getCollectData(date, date2))
		forceUpdate()
	}

	return (
		<>
			<SafeAreaView>
				<StatusBar barStyle="dark-content" />
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					style={styles.scrollView}
				>
					<View style={styles.body}>
						<Text style={styles.title}>Coletas</Text>
						<View style={styles.container}>
							<Text style={styles.subtitle}>Data início</Text>
							<View style={styles.rowContainer}>
								<TextInput
									id="date"
									value={dateStr}
									onChangeText={_setDate}
									style={styles.input}
								/>
								<Button
									key="cal"
									title="Cal"
									onPress={() => setShowDatePicker(true)}
									style={styles.btn25p}
								/>
								{showDatePicker && (
									<DateTimePicker
										testID="dateTimePicker"
										value={date}
										mode="date"
										display="default"
										onChange={onChange}
									/>
								)}
							</View>
							<Text style={styles.subtitle}>Data fim</Text>
							<View style={styles.rowContainer}>
								<TextInput
									id="date"
									value={dateStr2}
									onChangeText={_setDate2}
									style={styles.input}
									ref={ref => setDateStr2Ref(ref)}
								/>
								<Button
									key="cal2"
									title="Cal2"
									onPress={() => setShowDatePicker2(true)}
									style={styles.btn25p}
								/>
								{showDatePicker2 && (
									<DateTimePicker
										testID="dateTimePicker2"
										value={date2}
										mode="date"
										display="default"
										onChange={onChange2}
									/>
								)}
							</View>
						</View>
						<View style={styles.container}>
							<CollectsTable data={collectData} />
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}