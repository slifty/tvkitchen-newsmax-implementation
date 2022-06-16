export function removeLastCharacter(str) {
	if (str.length === 0) {
		return str
	}
	return str.substring(0, str.length - 1)
}

export function containsLowercaseCharacters(str) {
	return (/[a-z]/.test(str))
}
