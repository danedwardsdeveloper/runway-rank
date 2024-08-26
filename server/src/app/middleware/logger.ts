import winston from 'winston';
import expressWinston from 'express-winston';

export const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp(),
		winston.format.align(),
		winston.format.printf(
			(info) => `${info.timestamp} ${info.level}: ${info.message}`
		)
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'debug.log' }),
	],
});

export const expressLogger = expressWinston.logger({
	winstonInstance: logger,
	meta: true,
	msg: 'HTTP {{req.method}} {{req.url}}',
	expressFormat: true,
	colorize: true,
});
