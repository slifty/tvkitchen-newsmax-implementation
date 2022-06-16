import { AbstractAppliance } from '@tvkitchen/appliance-core'
import { INTERVALS } from './constants'
import {
	calculateStartingPosition,
	generateSegmentPayloadsForPositionRange,
	getPeriodPosition,
} from './utils/segment'

/**
 * The SegmentGeneratorAppliance creates new segments based on the timestamps of a payload
 * stream.
 *
 * @extends AbstractAppliance
 */
class SegmentGeneratorAppliance extends AbstractAppliance {
	/**
	 * Create a VideoSegmentGeneratorAppliance.
	 */
	constructor(settings) {
		super({
			interval: INTERVALS.INFINITE,
			startingAt: (new Date()).toISOString(),
			segments: [0],
			backfill: true,
			...settings,
		})
		this.latestSegmentPayload = null
	}

	static getInputTypes = () => ['TEXT.CUE']

	static getOutputTypes = () => ['SEGMENT.START']

	/** @inheritdoc */
	audit = async () => true

	/** @inheritdoc */
	start = async () => {}

	/** @inheritdoc */
	stop = async () => {}

	/** @inheritdoc */
	invoke = async (payloadArray) => {
		const segmentorStartingPosition = calculateStartingPosition(
			this.settings.startingAt,
			payloadArray.getOrigin(),
		)
		const {
			interval,
			segments,
		} = this.settings
		const rangeEndPosition = payloadArray.getPosition() + payloadArray.getDuration()
		const rangeStartPosition = (this.latestSegmentPayload !== null)
			? this.latestSegmentPayload.position + 1
			: getPeriodPosition(0, segmentorStartingPosition, interval)
		const segmentPayloads = generateSegmentPayloadsForPositionRange(
			rangeStartPosition,
			rangeEndPosition,
			segmentorStartingPosition,
			interval,
			segments,
		)
		if (segmentPayloads.length > 0) {
			[this.latestSegmentPayload] = segmentPayloads.slice(-1)
		}
		if (this.settings.backfill === true) {
			segmentPayloads.forEach((segmentPayload) => this.push(segmentPayload))
		} else {
			segmentPayloads.slice(-1).forEach((segmentPayload) => this.push(segmentPayload))
		}
		if (segmentPayloads.length > 0) {
			[this.latestSegmentPayload] = segmentPayloads.slice(-1)
		}
		return null
	}
}

export { SegmentGeneratorAppliance }
