import React, { Fragment, useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
	Cell,
	Col,
	Row,
	Table,
	TableWrapper
} from 'react-native-table-component'

export const CollectsTable = ({ data, editCollect }) => {
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			padding: 16,
			paddingTop: 30,
			backgroundColor: '#fff'
		},
		singleHead: { height: 40 },
		head: { backgroundColor: '#c8e1ff' },
		title: { backgroundColor: '#f6f8fa' },
		titleText: { marginLeft: 3, textAlign: 'left' },
		text: { textAlign: 'center' },
		btn: {
			width: 58,
			height: 18,
			marginLeft: 15,
			backgroundColor: '#c8e1ff',
			borderRadius: 2
		},
		btnText: { textAlign: 'center' },
		row: { height: 24, flexDirection: 'row', backgroundColor: '#fff1c1' },
		rowTotal: { marginLeft: 4, height: 24, flexDirection: 'row', backgroundColor: '#fefefe', borderTopWidth: 1 },
		rowCommission: { marginLeft: 4, height: 24, flexDirection: 'row', backgroundColor: '#fff2f2' },
		rowLiq: { marginLeft: 4, height: 24, flexDirection: 'row', backgroundColor: '#f2fff2' },
		textTotal: { color: '#000000' },
		textCommission: { color: '#e37777' },
		textLiq: { color: '#0a5e0a' }

	})

	let cellWidth = 56

	/*const onSelect = (id, val) => {
		let indices = selected
		const index = indices.indexOf(id)
		console.debug('collectslist save id', id, 'val', val)
		if (val) {
			// add
			console.debug('collectslist save indices index', index)
			if (index < 0) {
				//if (isCollectsScreen) indices = []
				indices.push(id)
			}
		} else {
			// remove
			index >= 0 && indices.splice(index, 1)
		}
		console.debug('placeslist save indices', indices)
		onSaveSelected(indices)
	}*/

	const [tableTitle, setTableTitle] = useState([])
	useEffect(() => {
		console.debug('collect data', data)
		if (!data) return
		if (!data.placesColumn) return

		let titles = []
		for (let i = 0; i < data.placesColumn.length; i++) {
			//const element = data.placesColumn[i];
			titles.push('Tot')
			titles.push('Com')
			titles.push('Líq')
		}
		setTableTitle(titles)
	}, [data])

	function placeIdByIndex(yIndex) {
		return data.placesIds[yIndex]
	}
	function onPressHandler(yIndex, evt) {
		if (yIndex >= data.placesColumn.length - 1) return
		let xIndex = ((evt.nativeEvent.pageX - 120) / 56) | 0
		console.log('Index:', yIndex, 'xIndex', xIndex, 'mrange length', data.monthRange.length, 'Event:', evt.nativeEvent)
		if (xIndex >= data.monthRange.length) return
		editCollect(placeIdByIndex(yIndex), xIndex)
	}

	if (!data || !data.values) return <Text>No collect data.</Text>
	if (!data.values.length) {
		return <Text>No collects found.</Text>
	}

	//console.log('collectsTable values', JSON.stringify(data.values, null, 4))

	/* Reformat table according to data */
	return (
		<Table
			style={{ flexDirection: 'row' }}
			borderStyle={{ borderColor: 'transparent' }}
		>
			{/* Left Wrapper */}
			<TableWrapper>
				<Cell data="Locais" style={styles.singleHead} />
				<TableWrapper style={{ flexDirection: 'row' }}>
					<Col
						data={data.placesColumn}
						style={styles.head}
						heightArr={new Array(data.placesColumn.length).fill(72)}
						width={80}
						textStyle={styles.text}
					/>
					<Col
						data={tableTitle}
						style={styles.title}
						heightArr={new Array(data.placesColumn.length * 3).fill(24)}
						width={40}
						textStyle={styles.titleText}
					/>
				</TableWrapper>
			</TableWrapper>
			{/* Right Wrapper */}
			<ScrollView horizontal >
				<TableWrapper style={{ flex: 1 }}>
					<Row
						data={data.monthNames}
						style={{ height: 40, flexDirection: 'row' }}
						textStyle={styles.text}
					/>
					{
						/**************************
							Loop over places (rows) 
						 **************************/
						data.values.map((rowData, index) => {
							return (<Fragment key={index}>
								<TouchableOpacity onPress={evt => onPressHandler(index, evt)}>
									<Row key={`rowt_${index}}`}
										data={rowData.totals}
										widthArr={new Array(data.monthNames.length).fill(cellWidth)}
										style={styles.rowTotal}
										textStyle={styles.textTotal}
									/>
									<Row key={`rowc_${index}}`}
										data={rowData.commissions}
										widthArr={new Array(data.monthNames.length).fill(cellWidth)}
										style={styles.rowCommission}
										textStyle={styles.textCommission}
									/>
									<Row key={`rowl_${index}}`}
										data={rowData.liqs}
										widthArr={new Array(data.monthNames.length).fill(cellWidth)}
										style={styles.rowLiq}
										textStyle={styles.textLiq}
									/>
								</TouchableOpacity>
							</Fragment>)
						})
					}
				</TableWrapper>
			</ScrollView>
		</Table >
	)
}
