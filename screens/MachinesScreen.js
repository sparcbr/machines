import React, { useEffect, useState } from 'react'
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
} from 'react-native'
import { styles } from '../assets/styles/Globals'
import { DatasetService } from '../services/dataset'
import { MachineList } from './MachineList'

export const MachinesScreen = () => {
	//const [searchType, setSearchType] = useState('')

	const datasetService = DatasetService.getInstance()

	const [machineList, setMachineList] = useState(null);
	useEffect(() => {
		refreshData()
	}, [datasetService]);
	
	function refreshData() {
		if (datasetService) setMachineList(datasetService.getMachineList())
	}
	if (!machineList) return <Text>Loading</Text>
	
	return (
		<>
			<SafeAreaView>
				<StatusBar barStyle="dark-content" />
				<ScrollView
					contentInsetAdjustmentBehavior="automatic"
					style={styles.scrollView}
				>
					<MachineList data={machineList} onSave={(keyCode, description) => {
						datasetService.addMachine(keyCode, description)
						refreshData()
					}} />
				</ScrollView>
			</SafeAreaView>
		</>
	)
}
