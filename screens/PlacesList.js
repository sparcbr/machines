import React from 'react'
import { StyleSheet, Switch, Text } from 'react-native'
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component'
import { mainStyles } from '../assets/styles/Globals'
import { DateUtil } from '../shared/date'

export const PlacesList = ({ data, selected, onSaveSelected, isHomeScreen = false, isCollectsScreen = false }) => {
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			padding: 16,
			paddingTop: 30,
			backgroundColor: '#fff'
		},
		head: { height: 40, backgroundColor: '#f1f8ff' },
		wrapper: { flexDirection: 'row' },
		title: { flex: 1, backgroundColor: '#f6f8fa' },
		row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
		text: { textAlign: 'center' },
		btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
		btnText: { textAlign: 'center', color: '#fff' }
	})

	const onSelect = (id, val) => {
		let indices = selected
		const index = indices.indexOf(id)
		console.debug('placeslist save id', id, 'val', val)
		if (val) { // add
			console.debug('placeslist save indices index', index)
			if (index < 0) {

				if (isCollectsScreen) {
					// select only one at a time
					// deselect the other items
					indices = []
				}
				indices.push(id)
			}
		} else { // remove
			index >= 0 && indices.splice(index, 1)
		}
		console.debug('placeslist save indices', indices)
		onSaveSelected(indices)
	}

	// if (!placesList || !placesList.length) {
	if (!data || !data.length) {
		return <Text>No places found.</Text>
	}
	console.debug('selected placelist', selected)
	return (
		<Table borderStyle={{ borderColor: 'transparent' }}>
			<Row
				data={['Local', 'Bairro', 'Coleta', 'Obs.', 'Selecione']}
				style={styles.head}
				textStyle={styles.text}
			/>
			{data.map((rowData, index) => {
				console.debug('index=', index, rowData.id, selected.indexOf(rowData.id) >= 0)
				return (
					<TableWrapper key={index} style={styles.row}>
						<Cell
							key={`${index}_1`}
							data={rowData.name}
							textStyle={styles.text}
						/>
						<Cell
							key={`${index}_2`}
							data={rowData.address}
							textStyle={styles.text}
						/>
						<Cell
							key={`${index}_3`}
							data={isHomeScreen ? rowData.last : DateUtil.formatDate(rowData.lastCollect)}
							textStyle={styles.text}
						/>
						{isHomeScreen ?
							<Cell
								key={`${index}_4`}
								data={rowData.reminder}
								textStyle={styles.text}
							/> : <Cell
								key={`${index}_4`}
								data={rowData.reminder}
								textStyle={styles.text}
							/>}

						<Cell
							key={`${index}_5`}
							data={
								<Switch
									value={selected.indexOf(rowData.id) >= 0}
									onValueChange={value => onSelect(rowData.id, value)}
								/>
							}
							textStyle={styles.btn}
						/>
					</TableWrapper>
				)
			})}
		</Table>
	)
}
