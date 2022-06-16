import dayjs from 'dayjs'
import en from 'dayjs/locale/en'
import { removeLastCharacter } from './string'

export function getLatestMondayMidnight() {
	const origin = dayjs()
		.locale({
			...en,
			weekStart: 1,
		}) // Start the week on Monday
		.startOf('week')
	return origin.toDate()
}

export function getDayOffsetByCode(dayCode) {
	switch (dayCode) {
		case 'M':
			return 0
		case 'T':
			return 86400000
		case 'W':
			return 172800000
		case 'Th':
			return 259200000
		case 'F':
			return 345600000
		case 'S':
			return 432000000
		case 'Su':
			return 518400000
		default:
			return 0
	}
}

export function formatWalterDate(dayJsDate) {
	const formattedDate = dayJsDate
		.toDate()
		.toISOString()
	return removeLastCharacter(formattedDate) // walter spec doesn't include the `Z`
}
