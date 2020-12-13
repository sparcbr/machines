export const ObjectService = {
	replaceKeys(map, obj) {
		return Object.keys(obj).reduce(
			(acc, key) => ({
				...acc,
				...{ [map[key] || key]: obj[key] }
			}),
			{}
		)
	}
}
