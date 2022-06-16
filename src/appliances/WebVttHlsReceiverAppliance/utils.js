import fetch from 'node-fetch'
import path from 'path'
import HLS from 'hls-parser'
import webvtt from 'node-webvtt'

export const isHlsUrl = (url) => path.extname(url) === '.m3u8'

export const getRootUrl = (url) => path.parse(url).dir

export const arrayHasItem = (items, soughtItem, isEqual) => items.find(
	(item) => isEqual(item, soughtItem)
)

export const getNewItemsBy = (currentItems, nextItems, isEqual) => nextItems.filter(
	(nextItem) => !arrayHasItem(currentItems, nextItem, isEqual)
)

const wait = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

const fetchRetry = (url, delay, tries, fetchOptions = {}) => {
    function onError(err){
        var triesLeft = tries - 1;
        if(!triesLeft){
            // throw err;
			console.log('time out, returning blanks')
			return {"text": () => ''}
        }
        return wait(delay).then(() => fetchRetry(url, delay, triesLeft, fetchOptions));
    }
    return fetch(url,fetchOptions).catch(onError);
}

export const loadHlsData = async (url) => {
	const result = await fetchRetry(url, 5, 3)
	const m3u8Data = await result.text()
	const parsedData = HLS.parse(m3u8Data)
	return parsedData
}

export const loadWebVttData = async (url) => {
	const result = await fetchRetry(url, 5, 3)
	const data = await result.text()
	const parsedData = webvtt.parse(
		data,
		{
			meta: true,
			strict: false,
		},
	)
	return parsedData
}

export const convertWebVttCueToPayload = (cue) => ({
	data: cue.text,
	type: 'TEXT.CUE',
	position: Math.round(cue.start * 1000),
	duration: Math.round((cue.end - cue.start) * 1000),
	origin: '',
})
