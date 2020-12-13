import React from 'react'
import { ScrollView } from 'react-native'

export const CustomScrollView = props => {
	const specialProps = ['onRef', 'children']
	const allowedProps = [
		'ref',
		'keyboardShouldPersistTaps',
		'bounces',
		'horizontal',
		'showsHorizontalScrollIndicator',
		'alwaysBounceVertical',
		'persistentScrollbar',
		'style',
		'onScroll',
		'scrollEventThrottle',
		'onScrollBeginDrag',
		'onContentSizeChange',
		'scrollEnabled',
		'showsVerticalScrollIndicator',
		'refreshControl',
		'contentContainerStyle'
	]
	const scrollViewProps = {}
	const propsCopy = { ...props }

	propsCopy.contentContainerStyle = {
		flexGrow: 1,
		alignItems: 'center',
		...(propsCopy.contentContainerStyle || {})
	}

	Object.entries(propsCopy).forEach(([key, _value]) => {
		if (specialProps.includes(key)) return
		if (!allowedProps.includes(key)) {
			console.warn(`Prop ${key} not allowed on CustomScrollView`)
		} else {
			scrollViewProps[key] = propsCopy[key]
		}
	})

	if (props.onRef) {
		scrollViewProps.ref = props.onRef
	}

	return <ScrollView {...scrollViewProps}>{props.children}</ScrollView>
}
