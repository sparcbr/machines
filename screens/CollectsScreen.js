import { isEmpty, round, trim } from 'lodash'
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
import Toast from 'react-native-simple-toast'
import DateTimePicker from '@react-native-community/datetimepicker'
import InputSpinner from 'react-native-input-spinner'
import { DateUtil } from '../shared/date'
import { styles } from '../assets/styles/Globals'
import { DatasetService } from '../services/dataset'
import { PlacesList } from './PlacesList'

export const CollectsScreen = ({ route, navigation }) => {
	const [collectId, setCollectId] = useState(null)
	const datasetService = DatasetService.getInstance()
	const [searchName, setSearchName] = useState('')
	const [searchAddress, setSearchAddress] = useState('')
	const [searchNameRef, setSearchNameRef] = useState(null)

	const [date, setDate] = useState(new Date())
	const [dateStr, setDateStr] = useState(DateUtil.formatDate(new Date()))
	const [showDatePicker, setShowDatePicker] = useState(false)

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date
		setShowDatePicker(false)
		if (DateUtil.isValidDate(currentDate)) {
			if (selected.length) {
				let collect = datasetService.findCollectByMonth(selected[0], currentDate)
				if (collect) {
					setCollectId(collect.id)
					setCommission(collect.commission)
					setTotal(collect.total)
					setReminder(collect.reminder)
				}
			}
			setDateStr(DateUtil.formatDate(currentDate))
			searchNameRef && searchNameRef.focus()
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

	const [total, setTotal] = useState(0.0)
	const [commission, setCommission] = useState(null)
	const [reminder, setReminder] = useState('')
	const [data, setData] = useState([])
	const [selected, setSelected] = useState(null)

	function _incTotal(inc) {
		let val = total
		if (isNaN(val)) val = 0.0
		val += inc
		setTotal(val)
	}

	function onTotalSpinnerChange(val) {
		if (isNaN(val)) {
			setTotal(0.0)
			return
		}
		setTotal(val)
	}

	function _incCommision(inc) {
		let val = commission
		if (isNaN(val)) val = 0.0
		val += inc
		setCommission(val)
	}

	function onCommissionSpinnerChange(val) {
		if (isNaN(val)) {
			setCommission(0.0)
			return
		}
		setCommission(val)
	}
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

	useEffect(() => {
		console.debug('render data selected =', selected)
	}, [data, selected])

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			// The screen is focused

		})

		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe
	}, [navigation])

	useEffect(() => {
		if (!route.params) return
		console.debug('route.param', route.param)
		if ((
			route.params.id !== collectId || !selected.length || route.params.placeId !== selected[0]
		)) {
			const d = new Date(route.params.date)
			if (DateUtil.isValidDate(d)) {
				setCollectId(route.params.id)
				setDateStr(DateUtil.formatDate(d))
				setDate(d)
				setCommission(route.params.commission)
				setTotal(route.params.total)
				setReminder(route.params.reminder)
				setSelected([route.params.placeId])
			} else {
				//setCollectId(null)
			}
		} else {
			//setCollectId(null)
		}
		//refreshData()
	})

	function clearForm() {
		setCollectId(null)
		setDateStr(DateUtil.formatDate(new Date()))
		setDate(new Date())
		setCommission(0.0)
		setTotal(0.0)
		setReminder('')
		setSelected([])
		console.debug('clearing Form')

		//refreshData()
	}
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
						<Text style={styles.title}>Coleta</Text>
						<View style={styles.container}>
							<Text style={styles.subtitle}>Data</Text>
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
							<Text style={styles.subtitle}>Local</Text>
							<Text style={styles.subtitle2}>Busca por nome</Text>
							<TextInput
								ref={ref => setSearchNameRef(ref)}
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
							<PlacesList
								data={data}
								selected={selected}
								onSaveSelected={indices => {
									datasetService.setSelected(indices)
									setSelected(datasetService.getSelected())
									refreshData()
								}}
								isCollectsScreen={true}
							/>
							<Text style={styles.subtitle}>Valor total</Text>
							<View style={styles.rowContainer}>
								<InputSpinner
									type="real"
									min={0}
									step={1}
									colorMax={'#f04048'}
									colorMin={'#40c5f4'}
									value={total}
									onChange={onTotalSpinnerChange}
									precision={1}
									prepend={
										<Text style={{ height: 50, paddingVertical: 14 }}> $</Text>
									}
									placeholderTextColor={'#555555'}
								/>
								<Button
									key="limpa"
									title="Limpa"
									onPress={() => setTotal(0.0)}
									style={styles.btn25p}
								/>
							</View>
							<View style={styles.rowContainer}>
								<Button
									title="+100"
									onPress={() => _incTotal(100.0)}
									style={styles.btn25p}
								/>
								<Button
									title="+50"
									onPress={() => _incTotal(50.0)}
									style={styles.btn25p}
								/>
								<Button
									title="+20"
									onPress={() => _incTotal(20.0)}
									style={styles.btn25p}
								/>
							</View>
							<View style={styles.rowContainer}>
								<Button
									title="+10"
									onPress={() => _incTotal(10.0)}
									style={styles.btn25p}
								/>
								<Button
									title="+5"
									onPress={() => _incTotal(5.0)}
									style={styles.btn25p}
								/>
								<Button
									title="+2"
									onPress={() => _incTotal(2.0)}
									style={styles.btn25p}
								/>
							</View>

							<Text style={styles.subtitle}>Valor da comissão</Text>
							<View style={styles.rowContainer}>
								<InputSpinner
									type="real"
									min={0}
									step={1}
									colorMax={'#f04048'}
									colorMin={'#40c5f4'}
									value={commission}
									onChange={onCommissionSpinnerChange}
									precision={0}
									prepend={
										<Text style={{ height: 50, paddingVertical: 14 }}> $</Text>
									}
									placeholderTextColor={'#555555'}
								/>
								<Button
									key="c25"
									title="25%"
									onPress={() => setCommission(round(0.25 * total, 0))}
									style={styles.btn25p}
								/>
								<Button
									key="c30"
									title="30%"
									onPress={() => {
										console.debug('round', round(0.3 * total, 0))
										setCommission(round(0.3 * total, 0))
									}}
									style={styles.btn25p}
								/>
								<Button
									key="limpa"
									title="Limpa"
									onPress={() => setCommission(0.0)}
									style={styles.btn25p}
								/>
							</View>
							<View style={styles.rowContainer}>
								<Button
									title="+100"
									onPress={() => _incCommision(100.0)}
									style={styles.btn25p}
								/>
								<Button
									title="+50"
									onPress={() => _incCommision(50.0)}
									style={styles.btn25p}
								/>
								<Button
									title="+20"
									onPress={() => _incCommision(20.0)}
									style={styles.btn25p}
								/>
							</View>
							<View style={styles.rowContainer}>
								<Button
									title="+10"
									onPress={() => _incCommision(10.0)}
									style={styles.btn25p}
								/>
								<Button
									title="+5"
									onPress={() => _incCommision(5.0)}
									style={styles.btn25p}
								/>
								<Button
									title="+2"
									onPress={() => _incCommision(2.0)}
									style={styles.btn25p}
								/>
							</View>
							<Text style={styles.subtitle}>Observaçao</Text>
							<TextInput
								id="reminder"
								value={reminder}
								onChangeText={setReminder}
								style={styles.input}
							/>
							<Button
								title={collectId ? "Salvar coleta " + collectId : "Adicionar coleta"}
								onPress={() => {
									if (!selected.length) return
									if (collectId) {
										if (
											datasetService.editCollect(
												selected[0],
												collectId,
												date,
												total,
												commission,
												reminder
											)
										) {
											Toast.showWithGravity(
												'Coleta atualizada.',
												Toast.LONG,
												Toast.TOP
											)
											clearForm()
										}
									}
									else if (
										datasetService.addCollect(
											selected[0],
											date,
											total,
											commission,
											reminder
										)
									) {
										Toast.showWithGravity(
											'Coleta adicionada.',
											Toast.LONG,
											Toast.TOP
										)
										refreshData()
									}
								}}
							/>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}
