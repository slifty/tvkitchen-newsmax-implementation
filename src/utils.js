
function newsmaxDateStringToDate(dateString) {
	const dateParts = dateString.match(
		/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/
	)
	const year = dateParts[1]
	const month = dateParts[2]
	const day = dateParts[3]
	const hour = dateParts[4]
	const minute = dateParts[5]
	const second = dateParts[6]
	const formattedDateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`
	return new Date(formattedDateString)
}

function getOffsetFromXTimestampMap(xTimestampMapValue) {
	const mapParts = xTimestampMapValue.match(
		/^(\d*):(\d{2}):(\d*).(\d*),MPEGTS:(\d*)$/
	)
	const hours = parseInt(mapParts[1])
	const minutes = parseInt(mapParts[2])
	const seconds = parseInt(mapParts[3])
	const milliseconds = parseInt(mapParts[4])
	const ptsOffset = parseInt(mapParts[5])

	const totalMinutes = (hours * 60) + minutes
	const totalSeconds = (totalMinutes * 60) + seconds
	const totalMilliseconds = (totalSeconds * 1000) + milliseconds
	const totalOffset = totalMilliseconds - (ptsOffset / 90)
	return Math.round(totalOffset)
}

export function getTimestampFromNewsmaxWebVtt(url, data) {
	const parts = url.split('/')
	const dateString = parts[7]
	const offset = getOffsetFromXTimestampMap(data.meta['X-TIMESTAMP-MAP=LOCAL'])
	const baseDate = newsmaxDateStringToDate(dateString)
	return new Date(baseDate.getTime() + offset)
}
