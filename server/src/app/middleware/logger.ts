import winston from 'winston';
import expressWinston from 'express-winston';

type Level = 'verbose' | 'info' | 'warn' | 'error' | 'debug' | 'silly';
const level: Level = 'verbose';

export const logger = winston.createLogger({
	level: level,
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp(),
		winston.format.align(),
		winston.format.printf((info) => `${info.level}: ${info.message}`)
	),
	transports: [new winston.transports.Console()],
});

export const expressLogger = expressWinston.logger({
	winstonInstance: logger,
	meta: true,
	msg: 'HTTP {{req.method}} {{req.url}}',
	expressFormat: true,
	colorize: true,
});
