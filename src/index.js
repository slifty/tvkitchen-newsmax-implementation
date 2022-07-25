import fs from 'fs'
import dotenv from 'dotenv'
import { Countertop } from '@tvkitchen/countertop'
import {
	WebVttHlsReceiverAppliance,
	TextReducerAppliance,
	FileRecorderAppliance,
	SegmentGeneratorAppliance,
	AwsUploaderAppliance,
} from './appliances'
import { CaptionSrtGeneratorAppliance } from '@tvkitchen/appliance-caption-srt-generator'
import { INTERVALS } from '@tvkitchen/appliance-video-segment-generator'
import { getTimestampFromNewsmaxWebVtt } from './utils'
import { logger } from './logger'

dotenv.config()

const countertop = new Countertop({
	kafkaSettings: {
		brokers: [process.env.KAFKA_BROKER],
		connectionTimeout: 30000,
	},
	logger,
})

const origin = new Date();
origin.setMinutes(0,0);

countertop.addAppliance(
	WebVttHlsReceiverAppliance,
	{
		url: 'https://nmxlive.akamaized.net/hls/live/529965/Live_1/index_cc.m3u8',
		calculateCurrentOrigin: getTimestampFromNewsmaxWebVtt,
	},
)
countertop.addAppliance(TextReducerAppliance)
countertop.addAppliance(
	SegmentGeneratorAppliance,
	{
		interval: INTERVALS.HOUR / 2,
		startingAt: origin.toISOString(),
		backfill: false,
	},
)
countertop.addAppliance(
	CaptionSrtGeneratorAppliance,
	{ includeCounter: false },
)
countertop.addAppliance(
	FileRecorderAppliance,
	{
		outDirectory: 'data',
		appendSeparator: '\n',
	},
)
countertop.addAppliance(
	AwsUploaderAppliance,
	{
		deleteAfterUpload: false,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		bucketName: process.env.AWS_BUCKET_NAME,
		bucketPrefix: process.env.AWS_BUCKET_PREFIX,
		bucketConfiguration: {
			LocationConstraint: process.env.AWS_BUCKET_REGION,
		},
	},
)

countertop.on('data', (payload) => {
	if (payload.type === 'TEXT.SRT') {
	}
	if (payload.type === 'FILE.OPENED') {
		logger.debug('OPENED FILE')
		logger.debug(payload.data)
	}
	if (payload.type === 'FILE.CLOSED') {
		logger.debug('CLOSED FILE')
		logger.debug(payload.data)
	}
	if (payload.type === 'FILE.UPLOADED') {
		logger.debug('UPLOADED FILE')
		logger.debug(payload.data)
	}
})
countertop.start()
