import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component'

export const MachineList = ({data, onSave}) => {
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
		row: { height: 28, flexDirection: 'row', backgroundColor: '#FFF1C1' },
		text: { textAlign: 'center' },
		btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
		btnText: { textAlign: 'center', color: '#fff' }
	})
	const [searchName, setSearchName] = useState('')
	const [keyCode, setKeyCode] = useState('')
	const [description, setDescription] = useState('');
	const [selectedIndices, setSelectedIndices] = useState([])
	const [machineList, setMachineList] = useState([])
	const onSelect = (id, val) => {
		const indices = selectedIndices
		const index = indices.indexOf(id)
		if (val) {
			// add
			index < 0 && indices.unshift(id)
		} else {
			// remove
			index >= 0 && indices.splice(index, 1)
		}
		setSelectedIndices(indices)
	}

	useEffect(() => {
		if (data && data.length) {
			console.debug('data=', data)
			setMachineList(data.filter(e => e.keyCode.toLowerCase().indexOf(searchName.toLowerCase()) >= 0))
		}
	}, [data, searchName])

	console.debug('machineList=', machineList)
	return (
		<View style={styles.body}>
			<Text style={styles.title}>Maquinas</Text>
			<View style={styles.container}>
				<Text style={styles.title}>Maquina</Text>
				<TextInput
					id="keyCode"
					value={keyCode}
					onChangeText={text => setKeyCode(text)}
				/>
				<Text style={styles.title}>Description</Text>
				<TextInput
					id="desc"
					value={description}
					onChangeText={text => setDescription(text)}
				/>
				<Button
					title="Salvar"
					onPress={() => {
						console.debug('save', keyCode, description)
						keyCode && onSave(keyCode, description)
					}}
				/>
			</View>
			<View style={styles.container}>
				<Text style={styles.title}>Busca por nome</Text>
				<TextInput
					id="searchName"
					value={searchName}
					onChangeText={text => setSearchName(text)}
				/>
			</View>
			{machineList && machineList.length ? (
				<Table borderStyle={{ borderColor: 'transparent' }}>
					<Row
						data={['Código', 'Descrição', 'Status']}
						style={styles.head}
						textStyle={styles.text}
					/>
					{machineList.map((rowData, index) => {
						const value = selectedIndices.indexOf(rowData.id) >= 0
						return (
							<TableWrapper key={index} style={styles.row}>
								<Cell
									key={`${index}_1`}
									data={rowData.keyCode}
									textStyle={styles.text}
								/>
								<Cell
									key={`${index}_2`}
									data={rowData.description}
									textStyle={styles.text}
								/>
								<Cell
									key={`${index}_3`}
									data={rowData.status}
									textStyle={styles.text}
								/>
								<Cell
									key={`${index}_4`}
									data={
										<Switch
											value={value}
											onValueChange={value => onSelect(rowData.id, value)}
										/>
									}
									textStyle={styles.btn}
								/>
							</TableWrapper>
						)
					})}
				</Table>
			) : (
				<Text>No machines found.</Text>
			)}
		</View>
	)
}
