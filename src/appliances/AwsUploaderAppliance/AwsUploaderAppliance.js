import fs from 'fs'
import path from 'path'
import AWS from 'aws-sdk'
import {
	PayloadArray,
	Payload,
} from '@tvkitchen/base-classes'
import { AbstractAppliance } from '@tvkitchen/appliance-core'

export class AwsUploaderAppliance extends AbstractAppliance {
	constructor(settings) {
		super({
			deleteAfterUpload: false,
			accessKeyId: '',
			secretAccessKey: '',
			bucketName: '',
			bucketPrefix: '',
			bucketConfiguration: {},
			...settings,
		})
		this.currentFile = null
		this.currentFilePath = ''
		this.s3 = new AWS.S3({
			accessKeyId: this.settings.accessKeyId,
			secretAccessKey: this.settings.secretAccessKey,
		})
	}

	static getInputTypes = () => ['FILE.CLOSED']

	static getOutputTypes = () => ['FILE.UPLOADED']

	/** @inheritdoc */
	audit = async () => {
		return true
	}

	/** @inheritdoc */
	start = async () => {
	}

	/** @inheritdoc */
	stop = async () => {
	}

	/** @inheritdoc */
	invoke = async (payloadArray) => {
		payloadArray.toArray().forEach(async (payload) => {
			const filePath = payload.data
			const fileName = path.basename(filePath)
			const fileContent = fs.readFileSync(filePath)
			const params = {
				Bucket: this.settings.bucketName,
				Key: `${this.settings.bucketPrefix}/${fileName}`,
				Body: fileContent,
			}
			await this.s3.upload(params).promise()
			if (this.settings.deleteAfterUpload) {
				fs.unlinkSync(filePath)
			}
			this.push(new Payload({
				data: filePath,
				type: 'FILE.UPLOADED',
				position: payload.position,
				duration: 0,
				origin,
			}))
		})
		return new PayloadArray()
	}
}
