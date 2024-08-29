import { CorsOptions } from 'cors';

import { environment } from '../../environment.js';

const productionOrigin = environment.ALLOWED_ORIGIN;
const developmentOrigin = 'http://localhost:5173';

export const corsOptions: CorsOptions = {
	origin: environment.isProduction ? productionOrigin : developmentOrigin,
	methods: ['GET', 'POST', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	preflightContinue: false,
	optionsSuccessStatus: 204,
};
