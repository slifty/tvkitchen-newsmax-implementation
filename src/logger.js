import winston from 'winston'
import dotenv from 'dotenv'

dotenv.config()

export const logger = winston.createLogger({
	levels: {
		fatal: 0,
		error: 1,
		warn: 2,
		info: 3,
		debug: 4,
		trace: 5,
	},
	level: process.env.LOG_LEVEL ?? 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	],
})
