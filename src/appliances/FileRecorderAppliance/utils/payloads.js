import dayjs from 'dayjs'
import { formatWalterDate } from './time'
import { containsLowercaseCharacters } from './string'

export function payloadHasData(payload) {
	return (payload.data
	&& JSON.parse(payload.data.toString('utf8')) !== null)
}

export function getPayloadStartTime(payload) {
	return dayjs(payload.origin).add(payload.position)
}

export function getSrtPayloadCaptionLines(srtPayload) {
	const srtData = srtPayload.data.toString()
	const lines = srtData.split('\n')
		.slice(1, -1) // The first line is the SRT timestamp and the last is empty
	return lines
}

export function srtPayloadToCaptionLines(srtPayload) {
	const srtStartTime = getPayloadStartTime(srtPayload)
	const lines = getSrtPayloadCaptionLines(srtPayload)
	return lines.map((line) => `${formatWalterDate(srtStartTime)} ${line}`)
}

export function srtPayloadContainsLowercaseCharacters(srtPayload) {
	const lines = getSrtPayloadCaptionLines(srtPayload)
	return containsLowercaseCharacters(lines.join(''))
}
