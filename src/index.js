import { Countertop } from '@tvkitchen/countertop'
import {
	WebVttHlsReceiverAppliance,
	TextReducerAppliance,
} from './appliances'
import { CaptionSrtGeneratorAppliance } from '@tvkitchen/appliance-caption-srt-generator'
import { getTimestampFromNewsmaxWebVtt } from './utils'

const countertop = new Countertop()

countertop.addAppliance(
	WebVttHlsReceiverAppliance,
	{
		url: 'https://nmxlive.akamaized.net/hls/live/529965/Live_1/index_cc.m3u8',
		calculateCurrentOrigin: getTimestampFromNewsmaxWebVtt,
	},
)
countertop.addAppliance(TextReducerAppliance)

// Override due to a temporary bug
CaptionSrtGeneratorAppliance.getInputTypes = () => ['TEXT.ATOM']

countertop.addAppliance(CaptionSrtGeneratorAppliance)
countertop.on('data', (payload) => {
	if (payload.type === 'TEXT.SRT') {
		process.stdout.write(payload.data)
	}
})
countertop.start()
