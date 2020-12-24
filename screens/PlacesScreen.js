import React from 'react'
import { SafeAreaView, ScrollView, View, Text, StatusBar } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from '../assets/styles/Colors'
import { styles } from '../assets/styles/Globals'

function PlacesList(data) {
	const { navigation, dimensions } = this.props

	return data.map((item, i) => {
		return (
			<View key={i} style={}>
				<TouchableOpacity onPress={() => {}}>
					<Text style={}>{item.title}</Text>
				</TouchableOpacity>
			</View>
		)
	})
}

export const PlacesScreen = ({ navigation }) => {
	//const [searchType, setSearchType] = useState('')

	const dataset = [
		['Mercado chinelão', 'Camobi', 40],
		['Loja de chocolates', 'Shopping Sta Maria', 30]
	]
	const onSubmit = data => {
		return alert(JSON.stringify(data))
	}

	const placesList = data => {
		/* const data =
			state.fetchedData && state.fetchedData.data
				? state.fetchedData.data
				: null */

		if (data === null || !data.length) {
			return <p>No places found.</p>
		}
	}

	function filterByName(text) {}
	function onChangeSearchName(text) {
		filterByName(text)
	}
	function onChangeSearchAddress(text) {
		filterByName(text)
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
						<p>Locais</p>
						{/*	<form onSubmit={handleSubmit(onSubmit)}>*/}
						<View style={styles.sectionContainer}>
							<Text style={styles.sectionTitle}>Busca por nome</Text>
							<TextInput
								name="searchName"
								value="{searchName}"
								onChangeText={text => onChangeSearchName(text)}
							/>
							<Text style={styles.sectionTitle}>Busca por endereço</Text>
							<TextInput
								name="searchAddress"
								value="{searchAddress}"
								onChangeText={text => onChangeSearchAddress(text)}
							/>
						</View>
						<PlacesList data={dataset} />
						{/* </form> */}
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}
