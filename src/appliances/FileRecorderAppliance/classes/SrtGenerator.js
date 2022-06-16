import { Srt } from './Srt'

export class SrtGenerator {
	constructor(srtDirectory) {
		this.srtDirectory = srtDirectory
	}

	generateSrt(fileName) {
		return new Srt({
			basePath: this.srtDirectory,
			fileName,
		})
	}
}
