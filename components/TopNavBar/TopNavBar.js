import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { styles } from './Styles'
import backArrowIconActive from '../../assets/images/back-arrow-icon-active.png'
import backArrowIconActiveInverse from '../../assets/images/back-arrow-icon-active-inverse.png'

export const TopNavBar = ({ navigation, rightSideContent }) => {
	function goBack() {
		navigation.goBack()
	}

	return (
		<View style={styles.wrapper}>
			<View style={styles.sideContent}>
				<TouchableOpacity style={styles.backArrowWrapper} onPress={goBack}>
					<Image
						style={styles.backArrow}
						source={
							navigation.state.routeName === 'Review'
								? backArrowIconActiveInverse
								: backArrowIconActive
						}
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.mainContent} />
			<View style={styles.sideContent}>{rightSideContent}</View>
		</View>
	)
}
