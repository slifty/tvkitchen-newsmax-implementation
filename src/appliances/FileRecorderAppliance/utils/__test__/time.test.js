import {
	getLatestMondayMidnight,
	getDayOffsetByCode,
} from '../time'

describe('getLatestMondayMidnight', () => {
	it('should return the proper date when called on a Monday', () => {
		jest
			.useFakeTimers('modern')
			.setSystemTime(new Date('2021-05-17 00:00:00').getTime())

		expect(getLatestMondayMidnight()).toEqual(
			new Date('2021-05-17 00:00:00'),
		)
	})
	it('should return the proper date when called on a Tuesday', () => {
		jest
			.useFakeTimers('modern')
			.setSystemTime(new Date('2021-05-18 00:00:00').getTime())
		expect(getLatestMondayMidnight()).toEqual(
			new Date('2021-05-17 00:00:00'),
		)
	})
	it('should return the proper date when called on a Wednesday', () => {
		jest
			.useFakeTimers('modern')
			.setSystemTime(new Date('2021-05-19 00:00:00').getTime())
		expect(getLatestMondayMidnight()).toEqual(
			new Date('2021-05-17 00:00:00'),
		)
	})
	it('should return the proper date when called on a Thursday', () => {
		jest
			.useFakeTimers('modern')
			.setSystemTime(new Date('2021-05-20 00:00:00').getTime())
		expect(getLatestMondayMidnight()).toEqual(
			new Date('2021-05-17 00:00:00'),
		)
	})
	it('should return the proper date when called on a Friday', () => {
		jest
			.useFakeTimers('modern')
			.setSystemTime(new Date('2021-05-21 00:00:00').getTime())
		expect(getLatestMondayMidnight()).toEqual(
			new Date('2021-05-17 00:00:00'),
		)
	})
	it('should return the proper date when called on a Saturday', () => {
		jest
			.useFakeTimers('modern')
			.setSystemTime(new Date('2021-05-22').getTime())
		expect(getLatestMondayMidnight()).toEqual(
			new Date('2021-05-17 00:00:00'),
		)
	})
	it('should return the proper date when called on a Sunday', () => {
		jest
			.useFakeTimers('modern')
			.setSystemTime(new Date('2021-05-23').getTime())
		expect(getLatestMondayMidnight()).toEqual(
			new Date('2021-05-17 00:00:00'),
		)
	})
	it('should return the proper date when called with hours / minutes / seconds', () => {
		jest
			.useFakeTimers('modern')
			.setSystemTime(new Date('2021-05-20T03:24:15').getTime())
		expect(getLatestMondayMidnight()).toEqual(
			new Date('2021-05-17 00:00:00'),
		)
	})
})

describe('getDayOffsetByCode', () => {
	it('should return the proper offset for Monday', () => {
		expect(getDayOffsetByCode('M')).toEqual(0 * 24 * 60 * 60 * 1000)
	})
	it('should return the proper offset for Tuesday', () => {
		expect(getDayOffsetByCode('T')).toEqual(1 * 24 * 60 * 60 * 1000)
	})
	it('should return the proper offset for Wednesday', () => {
		expect(getDayOffsetByCode('W')).toEqual(2 * 24 * 60 * 60 * 1000)
	})
	it('should return the proper offset for Thursday', () => {
		expect(getDayOffsetByCode('Th')).toEqual(3 * 24 * 60 * 60 * 1000)
	})
	it('should return the proper offset for Friday', () => {
		expect(getDayOffsetByCode('F')).toEqual(4 * 24 * 60 * 60 * 1000)
	})
	it('should return the proper offset for Saturday', () => {
		expect(getDayOffsetByCode('S')).toEqual(5 * 24 * 60 * 60 * 1000)
	})
	it('should return the proper offset for Sunday', () => {
		expect(getDayOffsetByCode('Su')).toEqual(6 * 24 * 60 * 60 * 1000)
	})
})
