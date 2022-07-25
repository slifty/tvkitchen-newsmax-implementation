function newsmaxDateStringToDate(dateString) {
	const dateParts = dateString.match(
		/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
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

export function getTimestampFromNewsmaxWebVtt(url) {
	const parts = url.split('/')
	const dateString = parts[7]
	const offset = 0
	const baseDate = newsmaxDateStringToDate(dateString)
	return new Date(baseDate.getTime() + offset)
}
