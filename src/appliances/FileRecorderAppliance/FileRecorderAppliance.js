import fs from 'fs'
import {
	PayloadArray,
	Payload,
} from '@tvkitchen/base-classes'
import { AbstractAppliance } from '@tvkitchen/appliance-core'
import { generateSegmentFileName } from './utils/files'

export class FileRecorderAppliance extends AbstractAppliance {
	constructor(settings) {
		super({
			outDirectory: './',
			appendSeparator: '',
			payloadParser: (payload) => payload.data,
			...settings,
		})
		this.currentFile = null
		this.currentFilePath = ''
	}

	static getInputTypes = () => ['TEXT.SRT', 'SEGMENT.START']

	static getOutputTypes = () => ['FILE.CLOSED', 'FILE.OPENED']

	/** @inheritdoc */
	audit = async () => true

	/** @inheritdoc */
	start = async () => {
	}

	/** @inheritdoc */
	stop = async () => {
	}

	startNewRecording = (payload) => {
		const {
			position,
			origin,
		} = payload

		if (this.currentFile) {
			const oldFile = this.currentFile
			const oldFilePath = this.currentFilePath
			this.currentFile = null
			this.currentFilePath = ''
			fs.closeSync(oldFile)
			this.push(new Payload({
				data: oldFilePath,
				type: 'FILE.CLOSED',
				position,
				duration: 0,
				origin,
			}))
		}

		const fileName = generateSegmentFileName(payload)
		this.currentFilePath = `${this.settings.outDirectory}/${fileName}`
		this.currentFile = fs.openSync(
			`${this.currentFilePath}`,
			'a',
		)
		this.push(new Payload({
			data: this.currentFilePath,
			type: 'FILE.OPENED',
			position,
			duration: 0,
			origin,
		}))
	}

	processSrtPayload(payload) {
		if (this.currentFile) {
			const parsedData = this.settings.payloadParser(payload)
			fs.writeSync(this.currentFile, parsedData)
			fs.writeSync(this.currentFile, this.settings.appendSeparator)
		}
	}

	/** @inheritdoc */
	invoke = async (payloadArray) => {
		payloadArray.toArray().forEach((payload) => {
			switch (payload.type) {
				case 'TEXT.SRT':
					this.processSrtPayload(payload)
					break
				case 'SEGMENT.START':
					this.startNewRecording(payload)
					break
				default:
			}
		})
		return new PayloadArray()
	}
}
