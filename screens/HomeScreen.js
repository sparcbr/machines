import React from 'react'
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { colors } from '../assets/styles/Colors'
import { styles } from '../assets/styles/Globals'

export const HomeScreen = ({ navigation }) => {
	// const [searchType, setSearchType] = useState('')
	const [searchName, setSearchName] = useState('')
	const [searchAddress, setSearchAddress] = useState('')

	const onSubmit = data => alert(JSON.stringify(data))

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
						<View style={styles.sectionContainer}>
							<Text style={styles.sectionTitle}>Busca por nome</Text>
							<TextInput
								name="searchName"
								value="{searchName}"
								onChangeText={text => onChangeSearchName(text)}
							/>
							<TextInput
								name="searchAddress"
								value="{searchAddress}"
								onChangeText={text => onChangeSearchAddress(text)}
							/>
						</View>
						<PlacesList data="dataset" />
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}
