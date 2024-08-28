import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
	// origin: (origin, callback) => {
	// 	callback(null, true);
	// },
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	preflightContinue: false,
	optionsSuccessStatus: 204,
};
