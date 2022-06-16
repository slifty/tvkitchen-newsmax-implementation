import {
	containsLowercaseCharacters,
} from '../string'

describe('containsLowercaseCharacters', () => {
	it('should return true for strings that contain lowercase characters', () => {
		expect(containsLowercaseCharacters('ABCdeF.'))
			.toBe(true)
	})
	it('should return false for strings that do not contain lowercase characters', () => {
		expect(containsLowercaseCharacters('ABCDEF.'))
			.toBe(false)
	})
})
