import { environment } from '../environment';

enum LogLevel {
	ERROR = 0,
	WARN = 1,
	INFO = 2,
	DEBUG = 3,
}

class Logger {
	private level: LogLevel;

	constructor(level: LogLevel = LogLevel.INFO) {
		this.level = level;
	}

	error(message: string, ...args: any[]) {
		if (this.level >= LogLevel.ERROR) {
			console.error(message, ...args);
		}
	}

	warn(message: string, ...args: any[]) {
		if (this.level >= LogLevel.WARN) {
			console.warn(message, ...args);
		}
	}

	info(message: string, ...args: any[]) {
		if (this.level >= LogLevel.INFO) {
			console.info(message, ...args);
		}
	}

	debug(message: string, ...args: any[]) {
		if (this.level >= LogLevel.DEBUG) {
			console.debug(message, ...args);
		}
	}

	setLevel(level: LogLevel) {
		this.level = level;
	}
}

export const logger = new Logger(
	environment.isProduction ? LogLevel.DEBUG : LogLevel.ERROR
);
