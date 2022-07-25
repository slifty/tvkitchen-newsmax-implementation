import {
	PayloadArray,
	Payload,
} from '@tvkitchen/base-classes'
import { AbstractAppliance } from '@tvkitchen/appliance-core'

function parseLines(str) {
	return str.replace(/\r\n/g, '\n')
		.split('\n')
}

function getDiff(strA, strB) {
	return strA.split(strB).join('')
}

function convertCharactersToPayloads(cueText, payload) {
	const {
		duration,
		position,
		origin,
	} = payload
	const atomDuration = duration / cueText.length
	return Array.from(cueText)
		.map((atom, index) => new Payload({
			data: atom,
			type: 'TEXT.ATOM',
			position: Math.trunc(position + index * atomDuration),
			duration: Math.trunc(atomDuration),
			origin,
		}))
}

export class TextReducerAppliance extends AbstractAppliance {
	constructor(settings) {
		super(settings)
		this.previousCue = ''
	}

	static getInputTypes = () => ['TEXT.CUE']

	static getOutputTypes = () => ['TEXT.ATOM']

	/** @inheritdoc */
	audit = async () => true

	/** @inheritdoc */
	start = async () => {
	}

	/** @inheritdoc */
	stop = async () => {
	}

	/** @inheritdoc */
	invoke = async (payloadArray) => {
		payloadArray.toArray().forEach((payload) => {
			const lines = parseLines(payload.data.toString())
			const newCue = `\n${lines.pop().trim()}`
			const newCharacters = getDiff(newCue, this.previousCue)
			this.previousCue = newCue
			const payloads = convertCharactersToPayloads(
				newCharacters,
				payload,
			)
			payloads.forEach((outputPayload) => {
				this.push(outputPayload)
			})
		})
		return new PayloadArray()
	}
}
