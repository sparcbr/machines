import React, { forwardRef } from 'react'
import { Image, Share, Text, TouchableOpacity, Platform } from 'react-native'
import { Tooltip } from 'react-native-elements'
import { isEmpty } from 'lodash'
import shareIcon from '../../assets/images/dark-share-icon.png'

export const ShareButton = forwardRef(({ data, callback }, ref) => {
	function onShare() {
		try {
			callback && callback()
			if (isEmpty(data)) return
			Share.share(
				{ message: data.message },
				Platform.select({
					android: {},
					ios: {
						subject: data.subject
					}
				})
			)
		} catch (error) {
			console.log('onShare Error:', error)
		}
	}

	return (
		<TouchableOpacity onPress={onShare}>
			<Image source={shareIcon} />
			<Tooltip ref={ref} withOverlay={false} popover={<Text>Compartilhar esta resenha</Text>} />
		</TouchableOpacity>
	)
})
