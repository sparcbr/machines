import React from 'react'
import renderer from 'react-test-renderer'
import { Button } from './Button'

describe('when <Button /> is mounted', () => {
	it('renders label correctly', () => {
		const tree = renderer.create(<Button label="My CTA" />).toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders no label button correctly', () => {
		const tree = renderer.create(<Button />).toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders miniLightWhite theme correctly', () => {
		const tree = renderer.create(<Button theme="miniLightWhite" />).toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders green theme correctly', () => {
		const tree = renderer.create(<Button theme="green" />).toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders yellow theme correctly', () => {
		const tree = renderer.create(<Button theme="yellow" />).toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders blue theme correctly', () => {
		const tree = renderer.create(<Button theme="blue" />).toJSON()
		expect(tree).toMatchSnapshot()
	})

	it('renders default theme correctly', () => {
		const tree = renderer.create(<Button />).toJSON()
		expect(tree).toMatchSnapshot()
	})
})
