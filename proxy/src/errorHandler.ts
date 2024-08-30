import {
	ErrorRequestHandler,
	Request,
	Response,
	NextFunction as ExpressNextFunction,
} from 'express';
import { NextFunction } from 'http-proxy-middleware/dist/types';

const errorHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: ExpressNextFunction
) => {
	console.error('Server Error:', err);
	res.status(500).json({
		error: 'Internal Server Error',
		message: err.message,
	});
};

export default errorHandler;

export const notFoundHandler = (
	req: Request,
	res: Response,
	next: ExpressNextFunction
) => {
	console.log(`Unhandled request: ${req.method} ${req.url}`);
	res.status(404).json({
		error: 'Not Found',
		message: 'The requested resource was not found.',
	});
};

export const setupUncaughtExceptionHandler = () => {
	process.on('unhandledRejection', (reason, promise) => {
		console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	});

	process.on('uncaughtException', (error) => {
		console.error('Uncaught Exception:', error);
		process.exit(1);
	});
};
