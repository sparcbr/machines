export const StringService = {
	replaceEmailNotAllowedCharsRegex: /[^a-z0-9+\-—._@]/,
	replaceNameNotAllowedCharsRegex: /[^'’A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s ]/,
	validEmailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

	capitalize(str) {
		return (
			str
				.toLowerCase()
				.charAt(0)
				.toUpperCase() + str.slice(1)
		)
	}
}
