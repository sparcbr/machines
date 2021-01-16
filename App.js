import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from './screens/HomeScreen'
import { PlacesScreen } from './screens/PlacesScreen'
import { MachinesScreen } from './screens/MachinesScreen'
import { CollectsScreen } from './screens/CollectsScreen'
import { CollectReportScreen } from './screens/CollectReportScreen'
/* import SQLite from 'react-native-sqlite-storage'

SQLite.DEBUG(true);
SQLite.enablePromise(false);

global.db = SQLite.openDatabase(
	{
	  name: 'SQLite',
	  location: 'default',
	  createFromLocation: '~SQLite.db',
	},
	() => { },
	error => {
	  console.log("ERROR: " + error);
	}
  ) */
 
const Tab = createBottomTabNavigator()

export const App = () => {
	return (
		<NavigationContainer>
			<Tab.Navigator initialRouteName="Home">
				<Tab.Screen name="Rota" component={HomeScreen} />
				<Tab.Screen name="Locais" component={PlacesScreen} />
				<Tab.Screen name="Coletar" component={CollectsScreen} />
				<Tab.Screen name="Tabela" component={CollectReportScreen} />
				{/* <Tab.Screen name="Maquinas" component={MachinesScreen} /> */}
			</Tab.Navigator>
		</NavigationContainer>
	)
}
