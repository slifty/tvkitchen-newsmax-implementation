import fs from 'fs'
import {
	srtPayloadToCaptionLines,
} from '../utils/payloads'

export class Srt {
	constructor({
		basePath = './',
		fileName,
	} = {}) {
		this.basePath = basePath
		this.fileName = fileName
		process.stdout.write(`Creating local file: ${this.getPath()}\n`)
		this.file = fs.openSync(
			`${this.getPath()}`,
			'a',
		)
	}

	appendPayload(payload) {
		const lines = srtPayloadToCaptionLines(payload)
		lines.forEach((line) => {
			fs.writeSync(this.file, line)
			fs.writeSync(this.file, '\n')
		})
	}

	getPath() {
		return `${this.basePath}/${this.fileName}`
	}

	delete() {
		process.stdout.write(`Deleting local file: ${this.getPath()}\n`)
		return fs.unlinkSync(this.getPath())
	}
}
